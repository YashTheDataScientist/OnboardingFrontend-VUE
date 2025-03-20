import { defineStore } from 'pinia'
import Swal from 'sweetalert2'

export const useTimerStore = defineStore('timer', {
  state: () => ({
    countdown: 0,
    isCounting: false,
    timer: null,
  }),
  
  getters: {
    formattedCountdown(state) {
      const hours = Math.floor(state.countdown / 3600)
      const minutes = Math.floor((state.countdown % 3600) / 60)
      const seconds = state.countdown % 60
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    }
  },

  actions: {
    setTimer(seconds) {
      if (this.timer) clearInterval(this.timer)

      this.countdown = seconds
      this.isCounting = true

      this.timer = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--
        } else {
          clearInterval(this.timer)
          this.isCounting = false
          
          Swal.fire({
            title: '⏰ Time to Reapply!',
            text: '❤️ Please reapply your sunscreen! ❤️',
            icon: 'warning',
            confirmButtonText: 'Got it!',
            customClass: {
              popup: 'custom-swal-popup'
            }
          })
        }
      }, 1000)
    },

    clearTimer() {
      if (this.timer) clearInterval(this.timer)
      this.isCounting = false
      this.countdown = 0
    }
  }
})