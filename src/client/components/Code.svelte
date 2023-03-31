<script lang="ts" context="module">
    import { CodeJar } from "codejar";
</script>

<script lang="ts">
    export let input = "";
    export let output = "";
    export let invalid = false;

    export function codedit(node: HTMLElement, cd: string) {
        const highlight = (editor: { textContent: any; innerHTML: any }) => {
            const code = editor.textContent;
            editor.innerHTML = code.replace(/(^\/\/.*)/g, "<span>$1</span>");
        };

        const editor = CodeJar(node, highlight);

        function update(cd: string) {
            editor.updateCode(cd);
        }

        editor.onUpdate((text) => {
            output = text;
        });

        update(cd);

        return {
            update,
            destroy() {
                editor.destroy();
            },
        };
    }
</script>

<pre><code use:codedit={input} class:invalid /></pre>
