import preprocess from "svelte-preprocess";

const config = {
  preprocess: preprocess({
    scss: {
      includePaths: ["src"]
    }
  })
};

export default config;
