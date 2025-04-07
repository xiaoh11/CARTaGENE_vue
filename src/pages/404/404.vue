<template>
  <NavBar style="margin-left: 5px;">
  </NavBar>
  <div style="justify-content: center; text-align: center;" class="border p-3 rounded">
    <h1>Oops!</h1>
    <span>there is no such page :(</span>
    <br>
    <span>
      Please try another one!
    </span>
    <div class="row justify-content-center d-flex" style="margin-top: 2%;">
      <div class="col-10 col-sm-8 col-md-6">
        <div id="search-box">
          <SearchBox :autofocus="true" v-on:noSearchResults="handleNoResults"></SearchBox>
        </div>
      </div>
    </div>
    <div class="row justify-content-center mt-3">
      <div class="col-10 col-sm-8 col-md-6">
        <p class="text-center text-muted">
          Examples:
          <template v-for="(item, index) in exampleLinks" :key="item.name">
            <a :href="item.url">{{ item.name }}</a><span v-if="index < exampleLinks.length - 1">, </span>
          </template>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue'
import SearchBox from '@/components/SearchBox.vue';

const exampleLinks = [
  { name: 'PCSK9', url: 'gene.html?id=PCSK9' },
  { name: '1:55,030,000-55,075,000', url: 'region.html?chrom=1&start=55030000&stop=55075000' },
  { name: '22-16389447-A-G', url: 'variant.html?chrom=22&pos=16389447&ref=A&alt=G' },
  { name: 'rs34747326', url: 'variant.html?chrom=22&pos=16389447&ref=A&alt=G' }
]


</script>
