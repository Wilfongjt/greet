<template>
  <section class="container">
    <Header />
    <Search />
    <Footer />
  </section>
</template>

<script>

import Header from '@/components/Header.vue'
import Search from '@/components/Search.vue'
import Footer from '@/components/Footer.vue'

export default {
  components: {
    Header,
    Search,
    Footer
  }
}
</script>
