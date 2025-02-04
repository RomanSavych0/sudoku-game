<template>
  <div class="cell" :class="{ editable: editable, error: error }" @click="focusCell">
    <input
        v-if="editable"
        :value="displayValue"
        @input="handleInput"
        type="number"
        min="1"
        max="9"
        :disabled="!editable"
        placeholder=" "
    />
    <span v-else>{{ displayValue }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';

export default defineComponent({
  props: {
    value: {
      type: String,  // Changed to String only
      default: ''
    },
    editable: {
      type: Boolean,
      default: false
    },
    error: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update'],
  setup(props, { emit }) {
    // Use displayValue to handle empty strings and numbers
    const displayValue = ref(props.value || '');

    // Watch for external value changes (like from hints)
    watch(() => props.value, (newVal) => {
      displayValue.value = newVal;
    });

    const handleInput = (event: Event) => {
      const input = event.target as HTMLInputElement;
      let value = input.value;

      // Handle backspace/delete
      if (value === '') {
        displayValue.value = '';
        emit('update', '');
        return;
      }

      // Convert to number and validate
      const num = parseInt(value, 10);
      if (isNaN(num)) {
        displayValue.value = '';
        return;
      }

      // Clamp values between 1-9
      const clamped = Math.min(Math.max(num, 1), 9).toString();
      displayValue.value = clamped;
      emit('update', clamped);
    };

    const focusCell = () => {
      if (props.editable) {
        // Focus logic if needed
      }
    };

    return { displayValue, handleInput, focusCell };
  }
});
</script>

<style scoped>
.cell {
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ccc;
  font-size: 1.5rem;
  background-color: #F0F0F0;
  cursor: pointer;  /* Ensure cursor is a pointer when hovering over the cell */
}

.cell.editable input {
  text-align: center;
  width: 100%;
  height: 100%;
  cursor: text;  /* Make sure cursor is text when inside the input field */
  padding: 0;  /* Remove extra padding */
  margin: 0;   /* Remove any margins */
}



input {
  width: 100%;
  text-align: center;
  background-color: white;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;  /* Hide the spinner arrows in Webkit-based browsers */
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield; /* Firefox */
}

.editable {
  background-color: #f9f9f9;
}

.completed-row-animation {
  background-color: #f9f9f9;
  animation: highlightRow 1s ease-in-out forwards;

}

@keyframes highlightRow {
  0% {
    background-color: rgba(0, 255, 0, 0.3);
    transform: scale(0.95);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.05);
    opacity: 1; /* Fully opaque */
  }
  100% {
    background-color: #F0F0F0;
    transform: scale(1); /* Return to normal size */
    opacity: 1; /* Fully opaque */
  }
}
.cell.error {
  background-color: #ffcccb  !important ;/* Red background for error */
  input{
    background-color: #ffcccb !important; ; /* Red background for error */
  }
}
</style>
