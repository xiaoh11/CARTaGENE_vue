<script>
import BaseFilterButton from '@/components/filters/BaseFilterButton.vue'

export default {
  name: "DemoButton",
  extends: BaseFilterButton,
  data: function() {
    return ({
      pFilter: {
        gColorFilter: {
          title: "Example Filter Group",
          allTrue: false,
          members: {
            blue: { 
              title: "Blue", 
              val: false,
              desc: "Is blue."
            },
            pink: { 
              title: "pink", 
              val: false,
              desc: "Is pink"
            }
          }
        },
      },
    })
  }
}
</script>
