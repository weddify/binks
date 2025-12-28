export class SiteSettings {
  heroSlides = $state([
    {
      id: crypto.randomUUID(),
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA9r63uH0kQSTF6CdO8YRXiy3sdlb8gPRpj8cqwRr8--FbYAUI6CsmXzOoLKMfXX21DPFdclKWjKsM-B57X1Bzp3tv19Xc3hOV5zsQ4zCigo68kjHOAhH3-LKyWLrD8OmOOYIhk2xZRcevO5uHj9I1gEgkiuH69QJ8Z6lRJHuzEhRCktB0TK26UBoMDQ-lynRSTfiWYpNQ8USbFcwoIpzyQX4DYpWqrDHCAAffxlO7BYs5vTWg3R1ikWkw5Vs4gdfpgI_ItlpqPWB3z",
      title:
        'Beli Akun Premium <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Instan</span>',
      description:
        "Akses ribuan aplikasi premium tanpa ribet. Pengiriman otomatis 24/7 langsung ke email kamu dalam hitungan detik.",
      badge: {
        text: "Instant Delivery",
        style: "bg-blue-500/20 border-blue-500/30",
        dotColor: "bg-blue-400",
        textColor: "text-blue-300",
      },
    },
    {
      id: crypto.randomUUID(),
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDhDJdyMBdka8n56wwXe1feEkpcfOQU5dgl0uKfzNcM-wmeRG1ewU3e6WYYEat12PldnWCyjeeZOD_JXNUAEb2zj57r7fmhnKMGLs-hp1Ne-_tEH9FJP3A2wi_H0xKSAC3P9j1IlrF3RPShD3wzKNqIeLWSMc-y0b1N38JOBBK4HEiD6Q14ipl3vYEiJegDmiS6H3xwXFll45IA2nTNGfg7jIwsBykvGKRa6AOp_-CR_chxSpxX3zl6NFfVUBDEwbF-eJ2EU5i-HEge",
      title:
        'Top Up Game <span class="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">Termurah</span>',
      description:
        "Valorant, Mobile Legends, Steam Wallet dan lainnya. Harga miring proses kilat, dijamin aman 100%.",
      badge: {
        text: "Game Populer",
        style: "bg-red-500/20 border-red-500/30",
        dotColor: "bg-red-400",
        textColor: "text-red-300",
      },
    },
  ]);

  slideDuration = $state(5000);

  addSlide(slide: any) {
    this.heroSlides.push({ ...slide, id: crypto.randomUUID() });
  }

  removeSlide(id: string) {
    this.heroSlides = this.heroSlides.filter((s) => s.id !== id);
  }

  updateSlide(id: string, updates: any) {
    const index = this.heroSlides.findIndex((s) => s.id === id);
    if (index !== -1) {
      this.heroSlides[index] = { ...this.heroSlides[index], ...updates };
    }
  }
}

export const siteSettings = new SiteSettings();
