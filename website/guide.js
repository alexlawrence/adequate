if (window.location.pathname.includes('guide')) {
  const sectionHeadlines = Array.from(document.querySelectorAll('h2'));

  document.querySelector('nav').insertAdjacentHTML(
    'afterbegin',
    `
    <div class="guide-dropdown-container">
      <select class="guide-dropdown">
        <option value="">jump to section</option>
        ${sectionHeadlines.map(
          (headline) =>
            `<option value="${headline.getAttribute('id')}">${headline.innerHTML}</option>`,
        )}
      </select>
    </div>
  `,
  );

  document.querySelector('.guide-dropdown').addEventListener('change', (event) => {
    window.location.hash = '#' + event.target.selectedOptions[0].value;
    window.scrollTo(window.scrollX, window.scrollY - 10);
  });
}
