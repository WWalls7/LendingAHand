export async function toast(message: string) {
    const toast = document.createElement('ion-toast');
    toast.message = message;
    toast.duration = 2000;
  
    document.body.appendChild(toast);
    return toast.present();
  }