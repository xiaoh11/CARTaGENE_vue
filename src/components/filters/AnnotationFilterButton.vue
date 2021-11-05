<script>
import BaseFilterButton from '@/components/filters/BaseFilterButton.vue'

export default {
  name: "AnnotationFilterButton",
  extends: BaseFilterButton,
  data: function() {
    return ({
      pFilter: {
        gSynVariants: {
          title: "All synonymous variants",
          allTrue: false,
          members: {
            "start_retained_variant": {
              title: "start retained",
              val: false,
              desc: "A sequence variant where at least one base in the start codon is changed, but the start remains"
            },
            "stop_retained_variant": {
              title: "stop retained",
              val: false,
              desc: "A sequence variant where at least one base in the terminator codon is changed, but the terminator remains"
            },
            "synonymous_variant": {
              title: "synonymous",
              val: false,
              desc: "A sequence variant where there is no resulting change to the encoded amino acid"
            }
          }
        },
        gNonSynVariants:{
          title: "All non-synonymous variants",
          allTrue: false,
          members: {
            "stop_gained": {
              title: "stop gained",
              val: false,
              desc: "A sequence variant whereby at least one base of a codon is changed, resulting in a premature stop codon, leading to a shortened transcript"
            },
            "frameshift_variant": {
              title: "frameshift",
              val: false,
              desc: "A sequence variant which causes a disruption of the translational reading frame, because the number of nucleotides inserted or deleted is not a multiple of three"
            },
            "stop_lost": {
              title: "stop lost",
              val: false,
              desc: "A sequence variant where at least one base of the terminator codon (stop) is changed, resulting in an elongated transcript"
            },
            "start_lost": {
              title: "start lost",
              val: false,
              desc: "A codon variant that changes at least one base of the canonical start codon"
            },
            "inframe_insertion": {
              title: "inframe insertion",
              val: false,
              desc: "An inframe non synonymous variant that inserts bases into in the coding sequence"
            },
            "inframe_deletion": {
              title: "inframe deletion",
              val: false,
              desc: "An inframe non synonymous variant that deletes bases from the coding sequence"
            },
            "missense_variant": {
              title: "missense",
              val: false,
              desc: "A sequence variant, that changes one or more bases, resulting in a different amino acid sequence but where the length is preserved"
            },
          }
        },
        allConseqs:{
          title: "ALL",
          allTrue: false,
          members:{
            "transcript_ablation": {
              title: "transcript ablation",
              val: false,
              desc: "A feature ablation whereby the deleted region includes a transcript feature"
            },
            "splice_acceptor_variant": {
              title: "splice acceptor",
              val: false,
              desc: "A splice variant that changes the 2 base region at the 3' end of an intron"
            },
            "splice_donor_variant": {
              title: "splice donor",
              val: false,
              desc: "A splice variant that changes the 2 base region at the 5' end of an intron"
            },
            "transcript_amplification": {
              title: "transcript amplification",
              val: false,
              desc: "A feature amplification of a region containing a transcript"
            },
            "protein_altering_variant": {
              title: "protein altering",
              val: false,
              desc: "A sequence_variant which is predicted to change the protein encoded in the coding sequence"
            },
            "splice_region_variant": {
              title: "splice region",
              val: false,
              desc: "A sequence variant in which a change has occurred within the region of the splice site, either within 1-3 bases of the exon or 3-8 bases of the intron"
            },
            "incomplete_terminal_codon_variant": {
              title: "incomplete terminal codon",
              val: false,
              desc: "A sequence variant where at least one base of the final codon of an incompletely annotated transcript is changed"
            },
            "coding_sequence_variant": {
              title: "coding sequence",
              val: false,
              desc: "A sequence variant that changes the coding sequence"
            },
            "mature_miRNA_variant": {
              title: "mature miRNA",
              val: false,
              desc: "A transcript variant located with the sequence of the mature miRNA"
            },
            "5_prime_UTR_variant": {
              title: "5' UTR",
              val: false,
              desc: "A UTR variant of the 5' UTR"
            },
            "3_prime_UTR_variant": {
              title: "3' UTR",
              val: false,
              desc: "A UTR variant of the 3' UTR"
            },
            "non_coding_transcript_exon_variant": {
              title: "non-coding transcript exon",
              val: false,
              desc: "A sequence variant that changes non-coding exon sequence in a non-coding transcript"
            },
            "intron_variant": {
              title: "intron",
              val: false,
              desc: "A transcript variant occurring within an intron"
            },
            "NMD_transcript_variant": {
              title: "NMD transcript",
              val: false,
              desc: "A variant in a transcript that is the target of NMD"
            },
            "non_coding_transcript_variant": {
              title: "non-coding transcript",
              val: false,
              desc: "A transcript variant of a non coding RNA gene"
            },
            "upstream_gene_variant": {
              title: "upstream",
              val: false,
              desc: "A sequence variant located 5' of a gene"
            },
            "downstream_gene_variant": {
              title: "downstream",
              val: false,
              desc: "A sequence variant located 3' of a gene"
            },
            "TFBS_ablation": {
              title: "TFBS ablation",
              val: false,
              desc: "A feature ablation whereby the deleted region includes a transcription factor binding site"
            },
            "TFBS_amplification": {
              title: "TFBS amplification",
              val: false,
              desc: "A feature amplification of a region containing a transcription factor binding site"
            },
            "TF_binding_site_variant": {
              title: "TF binding site",
              val: false,
              desc: "A sequence variant located within a transcription factor binding site"
            },
            "regulatory_region_ablation": {
              title: "regulatory region ablation",
              val: false,
              desc: "A feature ablation whereby the deleted region includes a regulatory region"
            },
            "regulatory_region_amplification": {
              title: "regulatory region amplification",
              val: false,
              desc: "A feature amplification of a region containing a regulatory region"
            },
            "feature_elongation": {
              title: "feature elongation",
              val: false,
              desc: "A sequence variant that causes the extension of a genomic feature, with regard to the reference sequence"
            },
            "regulatory_region_variant": {
              title: "regulatory region",
              val: false,
              desc: "A sequence variant located within a regulatory region"
            },
            "feature_truncation": {
              title: "feature truncation",
              val: false,
              desc: "A sequence variant that causes the reduction of a genomic feature, with regard to the reference sequence"
            },
            "intergenic_variant": {
              title: "intergenic",
              val: false,
              desc: "A sequence variant located in the intergenic region, between genes"
            }
          }
        }
      }
    })
  }
}
</script>

