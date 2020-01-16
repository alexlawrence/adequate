customElements.define(
  'x-last-commit',
  element(({ owner, repo }) => {
    const [commit, setCommit] = useState();
    useEffect(async () => {
      const { commit } = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/commits/HEAD`,
      ).then((response) => response.json());
      setCommit(commit);
    }, [owner, repo]);

    if (!commit) return html`<p>Loading...</p>`;
    return html`
      <h1>${owner}/${repo}</h1>
      <p>Last commit message: ${commit.message}</p>
    `;
  }),
);

document.body.innerHTML =
  '<x-last-commit owner="alexlawrence" repo="www.alex-lawrence.com"></x-last-commit>';
