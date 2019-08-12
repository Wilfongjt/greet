<template>
  <div id="search" class="band">
    <h1 class="title">
      {{ page.title }}
    </h1>

    <form id="search" @submit.prevent="onSubmit">
      <p>
        <label for="form.name" class="subtitle">{{ page.subtitle }}</label>
      </p>
      <p>
        <input id="name" v-model="form.name" placeholder="name">
      </p>
      <p>
        <!-- span>
          <button class="button" type="button" @click="wordMe();">
            Word Me
          </button>
        </span -->
        <span>
          <button :disabled="form.submitStatus === 'PENDING'" class="button" type="submit">
            Submit!
          </button>
        </span>
      </p>
    </form>
    <!--ul id="search-results"-->
    <div v-for="item in page.items" :key="item.id">
      <span>&nbsp;</span>
      <p class="subtitle">
        {{ item.id }} {{ item.title }}
      </p>
      <p>
        <span v-html="item.description" />
      </p>
    </div>
    <!--/ul-->
  </div>
</template>

<script>
import { AWSHandlers } from './mixins/AWSHandlers.js'
// if (process.env.NODE_ENV !== 'production') require('dotenv').config()

export default {
  data () {
    return {
      form: {
        name: ''
      },
      submitStatus: 'PENDING',
      page: {
        title: 'Greet',
        subtitle: 'Type Your Name',
        idCount: 0,
        items: []
      },
      session: {
        authorizationToken: 'Authorization'
      }
    }
  },
  computed: {
    // nameList: function () {
    nameList () {
      return this.form.name.split(' ')
    },
    awsHandlers () {
      return new AWSHandlers(this)
    },
    awsGuestHeader () {
      return {
        'Content-Type': 'application/json'
      }
    },
    awsGuestBody () {
      return process.env.GUEST
    },
    awsGatewayHeader () {
      return {
        // 'x-api-key': this.session.token,
        'Content-Type': 'application/json',
        'Authorization': this.session.authorizationToken
      }
    },
    awsGatewayBody () {
      return this.form
    }
  },
  mounted () {
    // at this point we want to make a connection a guest connection to our services
    this.awsHandlers.awsSignIn(process.env.SIGNIN, this.awsGuestHeader, this.awsGuestBody)
      .then((response) => {
        if (response.status === 200) {
          this.session.authorizationToken = response.data.token
          // check for results field
          this.feedBack('Type another!')
          this.addItem({
            title: 'Authorization',
            data: this.session.authorizationToken ? 'Ready to Go' : 'Unauthorized'
          })
        } else {
          this.feedBack('Something unexpected happened!')
          this.session.authorizationToken = 'Authorization'
        }
      })
      .catch((err) => {
        this.log('submit error 1: ' + err)
        this.session.authorizationToken = 'Authorization'
      })
  },
  methods: {
    log (msg) {
      /* eslint-disable no-console */
      // console.log(msg)
      /* eslint-enable no-console */
    },
    feedBack (msg) {
      this.page.subtitle = msg
    },
    onSubmit () { // submit button
      // clear the list
      // this.page.items = []
      this.awsHandlers.awsHello(process.env.HELLO, this.awsGatewayHeader, this.awsGatewayBody)
        .then((responce) => {
          if (responce.status === 200) {
            this.addItem({
              title: 'Greeting',
              data: responce.data.message
            })
          }
        })
        .catch((err) => {
          console.error(err)
          this.session.authorizationToken = 'Authorization'
        })
    },
    addItem (item) {
      // show result item to user
      const id = this.page.items.length + 1
      const title = item.title
      // const description = this.highlight(item.data)
      const description = item.data
      this.page.items.push({
        id,
        title,
        description
      })
    },
    addItems (itemArray) {
      // break down result into managable chunks
      let i = 0
      for (i = 0; i < itemArray.length; i++) {
        this.addItem(itemArray[i])
      }
    }
  }
}
</script>

<style scoped>
.band {
  width: 100%;
}

</style>
