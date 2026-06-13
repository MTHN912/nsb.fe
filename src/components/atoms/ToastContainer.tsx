import { createRoot } from 'react-dom/client';
import { Toast, ToastType } from './Toast';

let toastContainer: HTMLDivElement | null = null;
let toastRoot: any = null;

const showToast = (type: ToastType, title: string | undefined, message: string, duration?: number) => {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.style.position = 'fixed';
    toastContainer.style.top = '20px';
    toastContainer.style.right = '20px';
    toastContainer.style.zIndex = '9999';
    document.body.appendChild(toastContainer);
    toastRoot = createRoot(toastContainer);
  }

  const removeToast = () => {
    toastRoot.render(null);
    toastContainer?.remove();
    toastContainer = null;
    toastRoot = null;
  };

  toastRoot.render(
    <Toast
      type={type}
      title={title}
      message={message}
      duration={duration}
      onClose={removeToast}
    />
  );
};

export const toast = {
  success: (message: string, title?: string, duration?: number) => showToast('success', title, message, duration),
  error: (message: string, title?: string, duration?: number) => showToast('error', title, message, duration),
  info: (message: string, title?: string, duration?: number) => showToast('info', title, message, duration),
};
