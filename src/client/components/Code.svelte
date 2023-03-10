<script lang="ts" context="module">
    import { CodeJar } from "codejar";

    export function codedit(node: HTMLElement, code: string) {
        const highlight = (editor: { textContent: any; innerHTML: any }) => {
            const code = editor.textContent;
            editor.innerHTML = code.replace(/(^\/\/.*)/g, "<span>$1</span>");
        };

        const editor = CodeJar(node, highlight);

        function update(code: string) {
            editor.updateCode(code);
        }

        update(code);

        return {
            update,
            destroy() {
                editor.destroy();
            },
        };
    }
</script>

<script lang="ts">
    export let code = "";
</script>

<pre><code use:codedit={code} /></pre>
