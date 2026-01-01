import Swal from "sweetalert2";

// Create a themed instance of SweetAlert2
export const Alert = Swal.mixin({
  customClass: {
    popup:
      "!bg-white dark:!bg-slate-800 dark:text-white rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 font-sans",
    title: "text-slate-900 dark:text-white text-xl font-bold",
    htmlContainer: "text-slate-500 dark:text-slate-400",
    confirmButton:
      "bg-[#4a6df7] hover:bg-[#3b5bdb] text-white font-bold py-2.5 px-5 rounded-xl transition-colors shadow-lg shadow-primary/30 mx-2",
    cancelButton:
      "bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-200 font-bold py-2.5 px-5 rounded-xl transition-colors mx-2",
    input:
      "bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all",
  },
  buttonsStyling: false,
  background: "transparent", // Let Tailwind handle background via customClass
});

// Helper for standard delete confirmation
import type { SweetAlertOptions, SweetAlertIcon } from "sweetalert2";

export const ConfirmDelete: SweetAlertOptions = {
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning" as SweetAlertIcon,
  showCancelButton: true,
  confirmButtonText: "Yes, delete it!",
  cancelButtonText: "Cancel",
  reverseButtons: true, // Moves confirm to the right usually, or purely preference
};
