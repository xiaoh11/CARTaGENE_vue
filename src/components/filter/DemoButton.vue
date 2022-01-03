<script>
import BaseBooleanFilterButton from '@/components/filter/BaseBooleanFilterButton.vue'

export default {
  name: "DemoButton",
  extends: BaseBooleanFilterButton,
  data: function() {
    return ({
      pFiltSet: {
        gPassQC: {
          title: "All variants which pass QC",
          allTrue: false,
          members: {
            foo: {
              title: "Foo",
              val: false,
              desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
            }
          }
        },
      },
    })
  }
}
</script>
