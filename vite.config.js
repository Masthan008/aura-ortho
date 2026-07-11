import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        doctors: resolve(__dirname, 'doctors.html'),
        services: resolve(__dirname, 'services.html'),
        children: resolve(__dirname, 'children.html'),
        treatments: resolve(__dirname, 'treatments.html'),
        conditions: resolve(__dirname, 'conditions.html'),
        packages: resolve(__dirname, 'packages.html'),
        blog: resolve(__dirname, 'blog.html'),
        testimonials: resolve(__dirname, 'testimonials.html'),
        stories: resolve(__dirname, 'stories.html'),
        gallery: resolve(__dirname, 'gallery.html'),
        videos: resolve(__dirname, 'videos.html'),
        news: resolve(__dirname, 'news.html'),
        insurance: resolve(__dirname, 'insurance.html'),
        careers: resolve(__dirname, 'careers.html'),
        faqs: resolve(__dirname, 'faqs.html'),
        contact: resolve(__dirname, 'contact.html'),
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
