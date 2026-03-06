export function initializeAboutPage(containerId = "about"): void {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.classList.add("about");
  container.innerHTML = `
    <h2>Om WestCoast Education</h2>
    <p>
      WestCoast Education är ett utbildningsföretag beläget på västkusten strax norr om Göteborg.
      Vi har varit i utbildningsbranschen i snart 40 år och specialiserat oss på
      systemutvecklingsutbildningar inom webb och mobila lösningar.
    </p>
    <p>
      Vårt koncept är att erbjuda både klassrumsutbildningar och distansutbildningar
      där elever och lärare möts. Vi satsar nu även stort på on-demand-kurser —
      färdiginspelade utbildningar tillgängliga för visning i webbläsare,
      mobila enheter samt för nedladdning.
    </p>
    <p>
      Hos oss hittar du tekniska IT-utbildningar i framkant. Välkommen att utforska
      vårt kursutbud!
    </p>
  `;
}
