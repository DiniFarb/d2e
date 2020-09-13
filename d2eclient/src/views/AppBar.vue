<template>
  <v-container>
    <v-app-bar
        id="home-app-bar"
        app

        elevation="1"
        height="60"
        hide-on-scroll
    >

      <div>
        <v-toolbar-title
            class="heading, font-weight-bold"
            min-width="96"
        >D2E Exporter</v-toolbar-title>
      </div>
      <v-spacer />
      <div>
        <v-tabs
            class="hidden-sm-and-down"
            optional
        >
          <v-tab
              v-for="(name, i) in items"
              :key="i"
              :to="{ name }"
              :exact="name === 'Overview'"
              :ripple="false"
              active-class="text--secondary"
              class="font-bold"
              min-width="96"
              text
          >
            {{ name }}
          </v-tab>
        </v-tabs>
      </div>
    </v-app-bar>
  </v-container>
</template>

<script>
  export default {
    name: 'MainPage',

    data: () => ({
      items: [
        'Overview',
        'Download'
      ],
    }),
  }

</script>
