<script lang="ts">
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import Seo from '$lib/components/Seo.svelte';
  import { siteConfig } from '$lib/config';
  import { Mail, Phone, MapPin, Send, LoaderCircle } from 'lucide-svelte';
  import { toast } from 'svelte-sonner';

  let isLoading = $state(false);
  let formData = $state({
      name: '',
      email: '',
      subject: '',
      message: ''
  });

  async function handleSubmit(e: Event) {
      e.preventDefault();
      isLoading = true;
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Message sent successfully! We will get back to you soon.');
      
      // Reset form
      formData = {
          name: '',
          email: '',
          subject: '',
          message: ''
      };
      isLoading = false;
  }
</script>

<Seo 
  title="Contact Us" 
  description="Get in touch with us for any questions or support."
/>

<div class="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 font-sans relative transition-colors duration-300">
  <!-- Background Effects Container (Isolated Overflow) -->
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div class="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
  </div>

  <Navbar />

  <main class="flex-grow w-full max-w-[1200px] mx-auto px-2 md:px-2 py-8 md:py-10 relative z-10 text-slate-900 dark:text-white">
      
      <!-- Header -->
      <div class="text-center mb-10 md:mb-12">
          <h1 class="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
              Get in Touch
          </h1>
          <p class="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Have questions about our products or need support? We're here to help. Reach out to us through any of the channels below.
          </p>
      </div>

      <div class="flex flex-col lg:flex-row gap-4  w-full items-stretch">
          
          <!-- Contact Info Cards (Sidebar) -->
          <div class="w-full lg:w-1/3 flex-shrink-0">
              <div class="h-full bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none p-6 md:p-8 flex flex-col justify-between">
                <div>
                   <h2 class="text-2xl font-black text-slate-900 dark:text-white mb-6">Contact Details</h2>
                   <div class="space-y-8">
                       <!-- Email -->
                       <div class="group">
                           <div class="flex items-center gap-4 mb-2">
                               <div class="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                   <Mail class="size-5" />
                               </div>
                               <div>
                                   <div class="font-bold text-slate-900 dark:text-white text-sm">Email Support</div>
                                   <p class="text-slate-500 dark:text-slate-400 text-xs">Our team is here to help.</p>
                               </div>
                           </div>
                           <a href="mailto:{siteConfig.contact.email}" class="text-primary font-semibold hover:underline text-sm break-all pl-14 block">
                               {siteConfig.contact.email}
                           </a>
                       </div>
         
                       <!-- WhatsApp -->
                       <div class="group">
                           <div class="flex items-center gap-4 mb-2">
                               <div class="size-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                                   <Phone class="size-5" />
                               </div>
                               <div>
                                   <div class="font-bold text-slate-900 dark:text-white text-sm">WhatsApp</div>
                                   <p class="text-slate-500 dark:text-slate-400 text-xs">Chat with us directly.</p>
                               </div>
                           </div>
                           <a href={siteConfig.contact.whatsapp} target="_blank" rel="noopener noreferrer" class="text-emerald-600 font-semibold hover:underline text-sm pl-14 block">
                               Chat on WhatsApp
                           </a>
                       </div>
         
                        <!-- Hours -->
                        <div class="group">
                           <div class="flex items-center gap-4 mb-2">
                               <div class="size-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                   <MapPin class="size-5" />
                               </div>
                               <div>
                                   <div class="font-bold text-slate-900 dark:text-white text-sm">Office Hours</div>
                                   <p class="text-slate-500 dark:text-slate-400 text-xs">We are available online.</p>
                               </div>
                           </div>
                           <p class="font-semibold text-slate-700 dark:text-slate-200 text-sm pl-14">
                               {siteConfig.contact.onlineHours}
                           </p>
                       </div>
                   </div>
                </div>

                 <!-- Decorative / Info -->
                 <div class="mt-8 pt-8 border-t border-slate-100 dark:border-slate-700/50">
                    <p class="text-xs text-slate-400 text-center">
                        Need immediate assistance? <br> Check our <a href="/faq" class="text-primary hover:underline">FAQ section</a>.
                    </p>
                 </div>
              </div>
          </div>

          <!-- Contact Form (Main Content) -->
          <div class="w-full lg:w-2/3 flex-grow">
              <div class="h-full bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none p-6 md:p-8">
                  <div class="mb-8">
                    <h2 class="text-2xl font-black text-slate-900 dark:text-white mb-2">Send us a Message</h2>
                    <p class="text-slate-500 dark:text-slate-400 text-sm">Fill out the form below and we'll get back to you within 24 hours.</p>
                  </div>
                  
                  <form onsubmit={handleSubmit} class="space-y-6">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div class="space-y-2">
                              <label for="name" class="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">Your Name</label>
                              <input 
                                  type="text" 
                                  id="name" 
                                  bind:value={formData.name}
                                  required
                                  placeholder="John Doe"
                                  class="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-slate-900 dark:text-white placeholder:text-slate-400 text-sm font-medium"
                              />
                          </div>
                          <div class="space-y-2">
                              <label for="email" class="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">Email Address</label>
                              <input 
                                  type="email" 
                                  id="email" 
                                  bind:value={formData.email}
                                  required
                                  placeholder="john@example.com"
                                  class="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-slate-900 dark:text-white placeholder:text-slate-400 text-sm font-medium"
                              />
                          </div>
                      </div>

                      <div class="space-y-2">
                          <label for="subject" class="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">Subject</label>
                          <input 
                              type="text" 
                              id="subject" 
                              bind:value={formData.subject}
                              required
                              placeholder="How can we help you?"
                              class="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-slate-900 dark:text-white placeholder:text-slate-400 text-sm font-medium"
                          />
                      </div>

                      <div class="space-y-2">
                          <label for="message" class="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">Message</label>
                          <textarea 
                              id="message" 
                              bind:value={formData.message}
                              required
                              rows="5"
                              placeholder="Tell us more about your inquiry..."
                              class="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-slate-900 dark:text-white placeholder:text-slate-400 resize-none text-sm font-medium leading-relaxed"
                          ></textarea>
                      </div>

                      <button 
                          type="submit" 
                          disabled={isLoading}
                          class="w-full h-12 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wider"
                      >
                          {#if isLoading}
                              <LoaderCircle class="animate-spin size-5" />
                              Sending...
                          {:else}
                              <Send class="size-4" />
                              Send Message
                          {/if}
                      </button>
                  </form>
              </div>
          </div>
      </div>

  </main>
  
  <div class="relative z-20">
    <Footer />
  </div>
</div>
