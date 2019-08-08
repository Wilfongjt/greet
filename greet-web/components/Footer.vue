<template>
  <h1>...</h1>
  <!--nav>
      <ul>
        <li><nuxt-link to="/opportunities">Opportunities</nuxt-link></li>
        <li><nuxt-link to="/sponsors">Sponsors</nuxt-link></li>
        <li><nuxt-link to="/stats">Stats</nuxt-link></li>
        <li><nuxt-link to="/about">About</nuxt-link></li>
      </ul>
      <ul>
        <li v-for="item in footer.list"><a v-bind:href="item.href" target="_blank">{{ item.title }}</a></li>
      </ul>
  </nav-->
</template>
<script>

export default {
  data () {
    return {
      /* footer: {
        list: [
          {title: 'Github', href: 'https://github.com/citizenlabsgr'},
          {title: 'Slack', href: 'https://slack.com'}
        ]
      }
      */
    }
  }
}
</script>

<style scoped>
ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-flow:row wrap;
  justify-content: center;
  align-items: center;
}

li {
  margin: 20px 10px 0px 20px;
}

img {
  height: 50px
}
</style>
