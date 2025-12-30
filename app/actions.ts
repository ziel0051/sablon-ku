'use server';

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { writeFile } from 'fs/promises';
import path from 'path';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { signOut } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  
  // Ambil tipe input gambar (apakah 'url' atau 'upload')
  const imageType = formData.get('imageType') as string;
  let finalImageString = '';

  if (imageType === 'url') {
    // Jika user memilih URL, ambil string text biasa
    finalImageString = formData.get('imageUrl') as string;
  
  } else if (imageType === 'upload') {
    // Jika user memilih Upload, ambil object File
    const file = formData.get('imageFile') as File;
    
    if (file && file.size > 0) {
      // 1. Convert file menjadi Buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // 2. Buat nama file unik (pakai timestamp) agar tidak bentrok
      // Ganti spasi dengan dash agar aman di URL
      const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;

      // 3. Tentukan lokasi simpan (di folder public/uploads)
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      const filePath = path.join(uploadDir, filename);

      // 4. Simpan file fisik ke folder
      try {
        await writeFile(filePath, buffer);
        // 5. Set string untuk database (contoh: /uploads/gambar.jpg)
        finalImageString = `/uploads/${filename}`;
      } catch (error) {
        console.error('Gagal upload file:', error);
        throw new Error('Gagal menyimpan file gambar.');
      }
    }
  }

  // Generate Slug
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  // Simpan ke Database
  await prisma.post.create({
    data: {
      title,
      slug,
      content,
      image: finalImageString, // String URL atau Path Lokal masuk sini
    },
  });

  redirect('/blog'); // Nanti akan error 404 kalau page blog belum dibuat, itu wajar.
}

export async function authenticate(prevState: string | undefined, formData: FormData) {
  try {
    // Kita paksa redirect: false agar kita bisa handle manual
    await signIn('credentials', {
      ...Object.fromEntries(formData),
      redirect: false, 
    });
    
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Username atau Password salah.';
        default:
          return 'Terjadi kesalahan sistem.';
      }
    }
    throw error;
  }
  
  redirect('/admin');
}

export async function handleLogout() {
  await signOut({ redirectTo: '/login' });
}

// --- BLOG ACTIONS ---

export async function deletePost(formData: FormData) {
  const id = formData.get('id') as string;
  await prisma.post.delete({ where: { id } });
  revalidatePath('/blog');
  revalidatePath('/admin');
}

// --- PORTFOLIO ACTIONS ---

export async function createPortfolio(formData: FormData) {
  const title = formData.get('title') as string;
  const category = formData.get('category') as string;
  
  // Logic upload gambar (sama seperti blog)
  const imageType = formData.get('imageType') as string;
  let finalImageString = '';

  if (imageType === 'url') {
    finalImageString = formData.get('imageUrl') as string;
  } else if (imageType === 'upload') {
    const file = formData.get('imageFile') as File;
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `portfolio-${Date.now()}-${file.name.replace(/\s/g, '-')}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      const filePath = path.join(uploadDir, filename);
      
      try {
        await writeFile(filePath, buffer);
        finalImageString = `/uploads/${filename}`;
      } catch (error) {
        console.error('Upload error:', error);
      }
    }
  }

  await prisma.portfolio.create({
    data: {
      title,
      category,
      image: finalImageString,
    },
  });

  revalidatePath('/portfolio');
  revalidatePath('/admin');
  redirect('/admin'); // Kembali ke dashboard setelah simpan
}

export async function deletePortfolio(formData: FormData) {
  const id = formData.get('id') as string;
  await prisma.portfolio.delete({ where: { id } });
  revalidatePath('/portfolio');
  revalidatePath('/admin');
}

export async function updatePost(formData: FormData) {
  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const imageType = formData.get('imageType') as string;
  let finalImageString = formData.get('oldImage') as string; // Pakai gambar lama dulu

  // Jika ada input gambar baru
  if (imageType === 'url') {
    const url = formData.get('imageUrl') as string;
    if (url) finalImageString = url;
  } else if (imageType === 'upload') {
    const file = formData.get('imageFile') as File;
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      const filePath = path.join(uploadDir, filename);
      try {
        await writeFile(filePath, buffer);
        finalImageString = `/uploads/${filename}`;
      } catch (error) { console.error(error); }
    }
  }

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  await prisma.post.update({
    where: { id },
    data: { title, slug, content, image: finalImageString },
  });

  revalidatePath('/blog');
  revalidatePath('/admin');
  redirect('/admin');
}

export async function updatePortfolio(formData: FormData) {
  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const category = formData.get('category') as string;
  const imageType = formData.get('imageType') as string;
  let finalImageString = formData.get('oldImage') as string;

  if (imageType === 'url') {
    const url = formData.get('imageUrl') as string;
    if (url) finalImageString = url;
  } else if (imageType === 'upload') {
    const file = formData.get('imageFile') as File;
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `portfolio-${Date.now()}-${file.name.replace(/\s/g, '-')}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      const filePath = path.join(uploadDir, filename);
      try {
        await writeFile(filePath, buffer);
        finalImageString = `/uploads/${filename}`;
      } catch (error) { console.error(error); }
    }
  }

  await prisma.portfolio.update({
    where: { id },
    data: { title, category, image: finalImageString },
  });

  revalidatePath('/portfolio');
  revalidatePath('/admin');
  redirect('/admin');
}