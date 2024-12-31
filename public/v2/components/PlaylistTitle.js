export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  data() {
    return {
      editing: false,
    };
  },
  methods: {
    onClick() {
      this.editing = true;
      this.$nextTick(() => {
        this.$refs.input.focus();
        this.$refs.input.select();
      });
    },
  },
  template: `
    <h2 @click="onClick" class="playlist-editable-title">
      <input ref="input" @blur="editing = false" v-show="editing" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />
      <div v-if="!editing">
        {{ modelValue || 'Un-named' }}
        <button class="button-circle button-small">
          <svg color="#cecece" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="0.5" width="24" height="24"><defs><style>.cls-6374f8d9b67f094e4896c676-1{fill:none;stroke:currentColor;stroke-miterlimit:10;}</style></defs><path class="cls-6374f8d9b67f094e4896c676-1" d="M7.23,20.59l-4.78,1,1-4.78L17.89,2.29A2.69,2.69,0,0,1,19.8,1.5h0a2.7,2.7,0,0,1,2.7,2.7h0a2.69,2.69,0,0,1-.79,1.91Z"></path><line class="cls-6374f8d9b67f094e4896c676-1" x1="0.55" y1="22.5" x2="23.45" y2="22.5"></line><line class="cls-6374f8d9b67f094e4896c676-1" x1="19.64" y1="8.18" x2="15.82" y2="4.36"></line></svg>
        </button>
      </div>
    </h2>
  `,
}

