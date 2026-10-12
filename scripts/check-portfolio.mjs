import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";

const processCss = readFileSync("src/styles/global.css", "utf8");
const projectsComponent = readFileSync("src/components/home/projects/Proyects.astro", "utf8");
const portfolioCopy = readFileSync("src/content/portfolio.ts", "utf8");
const ownClientStatusPattern = /(current freelance|freelance with my own clients|freelancer with my own clients|work independently with my own clients|freelance con mis propios clientes|clientes propios)/i;
assert.match("Current work: I work independently with my own clients.", ownClientStatusPattern, "same-intent current own-client wording should be accepted");
assert.doesNotMatch("Current work: I work independently with clients.", ownClientStatusPattern, "independent work without own clients must not satisfy the own-client check");
const iconComponentPath = "src/components/ui/PortfolioIcon.tsx";
assert.ok(existsSync(iconComponentPath), "shared Phosphor icon registry must exist");
const iconComponent = readFileSync(iconComponentPath, "utf8");
assert.match(iconComponent, /data-interface-icon/);
assert.match(iconComponent, /aria-hidden="true"/);
assert.match(iconComponent, /focusable="false"/);
assert.match(iconComponent, /currentColor/);
for (const name of ["PiArrowUpRight", "PiEnvelopeSimple", "PiFileText", "PiGithubLogo", "PiTwitterLogo", "PiDiscordLogo", "PiFolderSimple", "PiToolbox", "PiChatCircle", "PiBriefcase", "PiListChecks"]) assert.ok(iconComponent.includes(name), `shared icon registry is missing ${name}`);
const experienceComponent = readFileSync("src/components/home/experience/Experiences.tsx", "utf8");
const processComponent = readFileSync("src/components/home/process/WorkProcess.astro", "utf8");
assert.match(processCss, /\.portfolio-heading-icon[^}]*color:\s*#15803d/);
assert.match(processCss, /html\.dark \.portfolio-heading-icon[^}]*color:\s*#4ade80/);
assert.match(processCss, /\.portfolio-heading\s*\{[^}]*align-items:\s*flex-start/);
assert.match(processCss, /\.portfolio-heading-icon[^}]*margin-top:\s*\.04em/);
assert.match(experienceComponent, /<PortfolioIcon name="experience"[^>]*\/>\s*<span>\{copy\.experienceHeading\}<\/span>/);
assert.match(processComponent, /<PortfolioIcon name="process"[^>]*\/>\s*<span>\{copy\.processHeading\}<\/span>/);
for (const path of ["src/components/home/Header.astro", "src/components/home/services/Services.astro", "src/components/home/services/ServiceIllustration.astro", "src/components/home/projects/Proyects.astro", "src/components/home/projects/ProjectCard.astro", "src/components/home/contact/Contact.astro", "src/components/home/contact/ContactsBar.astro"]) {
  const source = readFileSync(path, "utf8");
  assert.ok(!["lucide-astro", "lucide-react", "@tabler/icons-react"].some((family) => source.includes(`from "${family}"`) || source.includes(`from '${family}'`)), `${path}: active UI must use the shared Phosphor registry`);
}
assert.match(projectsComponent, /<p class="portfolio-section-intro">\{copy\.projectsIntro\}<\/p>[\s\S]*?<ProjectsList/, "projects need a localized intro before the project grid");
assert.match(portfolioCopy, /projectsIntro:\s*"Una selección de aplicaciones web e integraciones que he desarrollado\."/);
assert.match(portfolioCopy, /projectsIntro:\s*"A selection of web applications and integrations I have built\."/);
assert.match(processCss, /--portfolio-section-gap:\s*clamp\(3rem,\s*6vw,\s*6rem\)/, "peer boundary gap must be explicitly shared at 48px mobile to 96px desktop");
assert.match(processCss, /\.portfolio-section\s*\{[^}]*padding-block:\s*calc\(var\(--portfolio-section-gap\)\s*\/\s*2\)/, "peer section boundaries must share the total gap evenly");
assert.match(processCss, /\.portfolio-section-intro,[\s\S]*?\{[^}]*margin-top:\s*1\.75rem/, "section header-to-content gap must be explicitly distinct");
assert.match(processCss, /@media\s*\(min-width:\s*48rem\)\s*\{[^}]*\.portfolio-contact\s*\{[^}]*align-items:\s*start/, "responsive contact content must align to the section start to preserve the peer boundary gap");
assert.match(processCss, /\.portfolio-process-connector\s*\{[^}]*transform:\s*rotate\(90deg\)/, "single-column process connectors must point down at all narrow widths");
const tabletCss = processCss.slice(processCss.lastIndexOf("@media (min-width: 48rem)")).split("@media (min-width: 70rem)")[0];
assert.match(tabletCss, /nth-child\(3\)\s*\{[^}]*grid-column:\s*2[^}]*grid-row:\s*2/, "tablet step 3 must occupy bottom-right");
assert.match(tabletCss, /nth-child\(4\)\s*\{[^}]*grid-column:\s*1[^}]*grid-row:\s*2/, "tablet step 4 must occupy bottom-left");
assert.match(tabletCss, /nth-child\(3\) \.portfolio-process-connector\s*\{[^}]*left:\s*-1\.65rem[^}]*right:\s*auto[^}]*rotate\(180deg\)/, "tablet step 3 connector must leave its left edge toward step 4");
const desktopCss = processCss.slice(processCss.lastIndexOf("@media (min-width: 70rem)")).split("@media (max-width: 40rem)")[0];
assert.match(desktopCss, /nth-child\(3\),\s*\.portfolio-process-step:nth-child\(4\)\s*\{[^}]*grid-column:\s*auto[^}]*grid-row:\s*auto/);
assert.match(desktopCss, /nth-child\(3\) \.portfolio-process-connector\s*\{[^}]*left:\s*auto[^}]*right:\s*-1\.65rem[^}]*transform:\s*none/);

for (const locale of ["es", "en"]) {
  const path = `dist/${locale}/index.html`;
  assert.ok(existsSync(path), `missing generated ${locale} page`);
  const html = readFileSync(path, "utf8");
  assert.match(html, new RegExp(`<html[^>]+lang="${locale}"`));
  assert.match(html, /<title>[^<]+<\/title>/);
  const interfaceIcons = [...html.matchAll(/<svg\b[^>]*data-interface-icon="([^"]+)"[^>]*>/g)];
  assert.ok(interfaceIcons.length >= 12, `${locale}: rendered Phosphor interface icons missing`);
  for (const match of interfaceIcons) {
    const [attributes, name] = match;
    assert.ok(name, `${locale}: interface icon marker must name its semantic role`);
    assert.match(attributes, /aria-hidden="true"/, `${locale}: decorative icon must be hidden from assistive technology`);
    assert.match(attributes, /focusable="false"/, `${locale}: decorative icon must not be focusable`);
  }
  assert.match(html, /<meta name="description" content="[^"]+"/);
  assert.ok(html.includes(`hreflang="es" href="/es/"`) && html.includes(`hreflang="en" href="/en/"`), "missing reciprocal language alternates");
  assert.match(html, new RegExp(`href="/${locale === "es" ? "en" : "es"}/"`), "missing static language link");
  for (const id of ["experiences", "projects", "skills", "services", "contact"])
    assert.ok(html.includes(`id="${id}"`), `missing #${id} anchor`);
  for (const [id, title] of [["services", "servicesHeading"], ["projects", "projectsHeading"], ["experiences", "experienceHeading"], ["process", "processHeading"], ["contact", "contactHeading"]]) {
    const section = html.slice(html.lastIndexOf("<section", html.indexOf(`id="${id}"`)), html.indexOf(`id="${id}"`) + 900);
    const openingTag = section.match(/<section\b[^>]*>/)?.[0] || "";
    assert.match(openingTag, /class="[^"]*portfolio-section[^"]*portfolio-wrap[^"]*"/, `${locale}: #${id} must use shared section rhythm and wrapper`);
    assert.match(section, /<h2 class="[^"]*portfolio-heading[^"]*"/, `${locale}: #${id} must use the common peer heading role`);
    assert.ok(section.length > 0 && title, `${locale}: #${id} peer heading missing`);
  }
  const headingRoles = [["services", "tools"], ["projects", "folder"], ["experiences", "experience"], ["process", "process"], ["contact", "contact"]];
  for (const [id, role] of headingRoles) {
    const sectionStart = html.indexOf(`id="${id}"`);
    const headingStart = html.indexOf('<h2 class="portfolio-heading"', sectionStart);
    const heading = html.slice(headingStart, html.indexOf("</h2>", headingStart) + 5);
    assert.match(heading, new RegExp(`<svg\\b(?=[^>]*data-interface-icon="${role}")(?=[^>]*aria-hidden="true")(?=[^>]*focusable="false")[^>]*>[\\s\\S]*?<\\/svg>[\\s\\S]*?<span\\b`), `${locale}: #${id} icon must precede its localized heading text and be decorative`);
    assert.equal((heading.match(/data-interface-icon=/g) || []).length, 1, `${locale}: #${id} heading must have exactly one leading icon`);
  }
  assert.match(processCss, /\.portfolio-section\s*\{[^}]*padding-block:\s*calc\(var\(--portfolio-section-gap\)\s*\/\s*2\)/, "peer sections must divide the shared total boundary gap evenly");
  assert.match(processCss, /\.portfolio-wrap\s*\{[^}]*width:\s*min\(100%\s*-\s*2\.5rem,\s*80rem\)/, "peer sections must share the 80rem wrapper and 1.25rem gutters");
  assert.ok(html.includes("mendoza000.dev@gmail.com"), "email missing");
  assert.ok(html.includes("docs.google.com/document/d/1FZJGxmnlFurOBx3n6XwUYd3EJ1CoIkNi"), "CV link missing");
  assert.ok(!html.includes("client-only") && !html.includes("href=\"javascript:"), "navigation must be static");
  const nav = html.match(/<nav\b[^>]*>[\s\S]*?<\/nav>/)?.[0];
  assert.ok(nav, "emitted navigation missing");
  assert.match(nav, /\bsticky\b/, "navigation must remain in normal flow rather than overlaying content");
  assert.match(nav, /\bflex-wrap\b/, "navigation must wrap at narrow widths");
  assert.match(nav, /type="button"[^>]*aria-label="[^"]+"[^>]*aria-pressed="(?:true|false)"/, `${locale}: accessible theme toggle missing`);
  assert.match(nav, /data-theme-label-light="[^"]+"[^>]*data-theme-label-dark="[^"]+"/, `${locale}: localized theme labels missing`);
  assert.match(nav, /data-theme-toggle/, `${locale}: theme toggle behavior hook missing`);
  const process = html.slice(html.indexOf('id="process"'), html.indexOf('id="contact"'));
  assert.equal((process.match(/class="portfolio-process-step"/g) || []).length, 4, `${locale}: exactly four process cards required`);
  assert.equal((process.match(/class="portfolio-process-connector"/g) || []).length, 3, `${locale}: three process connectors required`);
  assert.equal((process.match(/<h3>/g) || []).length, 4, `${locale}: four process headings required`);
  assert.equal((process.match(/<p>/g) || []).length, 4, `${locale}: four process descriptions required`);
  assert.equal((process.match(/<svg[^>]*class="portfolio-process-connector"[^>]*aria-hidden="true"/g) || []).length, 3, `${locale}: three decorative connectors required`);
  const processCopy = locale === "es"
    ? ["Entender tu necesidad", "Conocer qué quieres resolver y cómo trabajas actualmente.", "Definir el camino", "Acordar alcance, prioridades y etapas.", "Construir por etapas", "Implementar la solución según lo acordado.", "Verificar el resultado", "Revisar el funcionamiento y los casos importantes."]
    : ["Understand your needs", "Learn what you want to solve and how you currently work.", "Define the path", "Agree on scope, priorities, and stages.", "Build in stages", "Implement the solution as agreed.", "Verify the result", "Review how it works and the important cases."];
  for (const phrase of processCopy) assert.ok(process.includes(phrase), `${locale}: process copy missing: ${phrase}`);
}
const root = readFileSync("dist/index.html", "utf8");
assert.match(root, /<html[^>]+lang="es"/);
assert.ok(root.includes('href="/es/"'), "root default must link to Spanish page");
const es = readFileSync("dist/es/index.html", "utf8");
const en = readFileSync("dist/en/index.html", "utf8");
assert.ok(es.includes("Experiencia y formación") && en.includes("Experience and education"), "localized section heading missing");
for (const url of ["https://devstopia.vercel.app", "https://x.com/mendoza000x", "https://github.com/mendoza000", "https://discordapp.com/users/mendoza000#2939", "https://www.aliabienestar.com/", "https://house-streaming.vercel.app/", "https://github.com/mendoza000/house-streaming-catalog/", "https://github.com/mendoza000/celisapp/releases/latest", "https://github.com/mendoza000/celisapp", "https://your-app-landing.vercel.app/", "https://github.com/mendoza000/your-app-landing"]) assert.ok(es.includes(url) && en.includes(url), `original destination missing: ${url}`);
for (const [locale, html] of [["es", es], ["en", en]]) {
  assert.match(html, /id="top"[\s\S]*?(Aplicaciones|Applications)[\s\S]*?(integraciones|integrations)/i, `${locale}: application/integration positioning missing`);
  assert.match(html, /id="top"[\s\S]*?id="services"[\s\S]*?id="projects"[\s\S]*?id="experiences"[\s\S]*?id="process"[\s\S]*?id="contact"/, `${locale}: commercial section order missing`);
  assert.match(html, /id="projects"[\s\S]*?ALIA[\s\S]*?House Streaming/, `${locale}: ALIA must lead project evidence`);
  assert.ok(!/2024\s*[-–]\s*(Present|Actualidad)/i.test(html), `${locale}: Atrinium must not appear current`);
  assert.ok(html.includes("2024 - 2026-09-21"), `${locale}: Atrinium end date missing`);
  assert.match(html, ownClientStatusPattern, `${locale}: current own-client freelance status missing`);
  assert.ok(!/overflow-y-scroll|max-h-\\[25rem\\]/.test(html), `${locale}: experience must remain open without nested scrolling`);
  assert.match(html, /id="services"[\s\S]*?(Automatización|Automation)/i, `${locale}: automation offer missing`);
  assert.match(html, /id="process"[\s\S]*?(alcance|scope)[\s\S]*?(implementar|implement)[\s\S]*?(verificar|verify)/i, `${locale}: proposed delivery approach missing`);
  const contact = html.slice(html.indexOf('id="contact"'), html.indexOf('id="contact"') + html.slice(html.indexOf('id="contact"')).indexOf("</section>") + 10);
  assert.ok(contact.length > 10, `${locale}: contact section missing`);
  assert.equal((contact.match(/href="mailto:mendoza000\.dev@gmail\.com"/g) || []).length, 1, `${locale}: exactly one matching email route inside contact`);
  assert.ok(contact.includes('href="https://docs.google.com/document/d/1FZJGxmnlFurOBx3n6XwUYd3EJ1CoIkNi/edit?usp=sharing&amp;ouid=101889099240565360165&amp;rtpof=true&amp;sd=true"'), `${locale}: contact CV destination missing`);
  for (const url of ["https://x.com/mendoza000x", "https://github.com/mendoza000", "https://discordapp.com/users/mendoza000#2939"])
    assert.ok(contact.includes(`href="${url}"`), `${locale}: contact social destination missing: ${url}`);
  assert.ok(contact.includes(locale === "es" ? "Hablemos" : "Get in touch"), `${locale}: localized contact heading missing`);
  assert.ok(contact.includes(locale === "es" ? "Cuéntame qué necesitas construir o conectar." : "Tell me what you need to build or connect."), `${locale}: localized contact intro missing`);
  const contactLinks = [...contact.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)];
  assert.equal(contactLinks.length, 5, `${locale}: contact should have two primary routes and three social routes`);
  for (const [, attrs] of contactLinks) {
    assert.match(attrs, /href=/, `${locale}: contact action must be a link`);
    assert.match(attrs, /class="portfolio-contact-item"/, `${locale}: contact link must use keyboard-focusable action styling`);
  }
  const emailLink = contactLinks.find(([, attrs]) => attrs.includes("mailto:"));
  assert.ok(emailLink && !/target="_blank"/.test(emailLink[1]), `${locale}: mailto must not open a new tab`);
  assert.ok(contactLinks.some(([, attrs]) => attrs.includes("target=\"_blank\"") && attrs.includes("rel=\"noopener noreferrer\"") && attrs.includes("docs.google.com")), `${locale}: CV must retain safe external-link behavior`);
  assert.match(html, /docs\.google\.com\/document\/d\/1FZJGxmnlFurOBx3n6XwUYd3EJ1CoIkNi/);
  for (const project of ["ALIA", "House Streaming", "Celisapp"]) assert.ok(html.includes(project), `${locale}: ${project} evidence missing`);
  assert.match(html, /alt="(?!project-screen|alia-screen|house-streaming-screen|celisapp-screen|nival-screen)[^"]{10,}"/i, `${locale}: descriptive localized image alt missing`);
  assert.match(html, /target="_blank" rel="noopener noreferrer"/);
  assert.ok(!html.includes("<iframe") && !html.includes("Play"), `${locale}: production services must not embed a demo or play control`);
  const figures = locale === "es"
    ? [["exploded", "web-app-rest.svg", "Ventana de aplicación por capas"], ["patch", "integrations-rest.svg", "Panel de conexiones con cables"], ["slow", "automation-rest.svg", "Cinta transportadora y compuerta"], ["gateway", "bookings-payments-rest.svg", "Tarjeta física pasando por un terminal POS"], ["terminal", "dashboard-rest.svg", "Pantalla operativa con filas e informes"], ["maintenance", "maintenance-rest.svg", "Ventana de código con una herramienta"]]
    : [["exploded", "web-app-rest.svg", "Layered application window"], ["patch", "integrations-rest.svg", "Cable integration panel"], ["slow", "automation-rest.svg", "Conveyor and gate"], ["gateway", "bookings-payments-rest.svg", "Physical card passing through a POS terminal"], ["terminal", "dashboard-rest.svg", "Operational screen with rows and reports"], ["maintenance", "maintenance-rest.svg", "Code editor window with an adjustment wrench"]];
  for (const [figure, asset, label] of figures) {
    assert.ok(existsSync(`public/hairline/${asset}`) && existsSync(`dist/hairline/${asset}`), `${locale}: ${figure} fallback asset missing from source or built output`);
    const position = html.indexOf(`data-figure="${figure}"`);
    assert.ok(position >= 0, `${locale}: ${figure} service host missing`);
    const cardEnd = html.indexOf("</article>", position);
    const card = html.slice(position, cardEnd);
    assert.ok(card.includes(`data-label="${label}"`) && card.includes(`/hairline/${asset}`) && card.includes(`alt="${label}"`), `${locale}: ${figure} needs its matching localized accessible fallback`);
    const host = card.match(/<div class="hairline-host"[^>]*>/)?.[0] || "";
    assert.ok(host.includes("data-hairline-host") && host.includes("--hairline-plate:#18181b") && host.includes("--hairline-hi:#4ade80") && host.includes("--hairline-edge:#789b7f"), `${locale}: Hairline palette must be inline on the actual render host`);
    const heading = card.match(/<h3[^>]*>/)?.[0] || "";
    assert.ok(heading.includes('style="color:#fafafa"'), `${locale}: each service heading must set its foreground directly on the rendered element`);
    const fallback = readFileSync(`public/hairline/${asset}`, "utf8");
    assert.match(fallback, /viewBox="0 0 640 512"/, `${figure}: fallback must share the native figure aspect`);
    assert.ok(fallback.includes("#4ade80"), `${figure}: static fallback needs the shared green accent`);
    if (figure === "gateway") assert.ok(fallback.includes('data-art="payment-reader"') && fallback.includes('data-art="payment-card"'), `${figure}: same-object fallback needs terminal and moving-card groups`);
    if (figure === "maintenance") assert.ok(fallback.includes('data-art="editor-window"') && fallback.includes('data-art="adjustment-wrench"'), `${figure}: same-object fallback needs editor-window and wrench groups`);
  }
  assert.equal((html.match(/data-service-figure/g) || []).length, 6, `${locale}: expected one native host per service`);
  assert.ok(!/tray|document-tray/i.test(html), `${locale}: rejected tray narrative leaked into production`);
  const servicesBlock = html.slice(html.indexOf('id="services"'), html.indexOf('id="experiences"'));
  assert.ok(!/Reservas y pagos en línea|Online bookings and payments|Teléfono en capas|Layered phone|Árbol de dependencias|Dependency tree/.test(servicesBlock), `${locale}: rejected phone/booking/dependency-tree service concepts remain visible`);
  const titles = locale === "es" ? ["Integración de pasarelas de pago", "Paneles internos e informes", "Mantenimiento y evolución de aplicaciones"] : ["Payment gateway integrations", "Internal dashboards and reporting", "Application maintenance and evolution"];
  for (const title of titles) assert.ok(html.includes(title), `${locale}: added service offer missing: ${title}`);
  const paymentCopy = locale === "es" ? ["checkout", "confirmación de transacciones", "estados de pago"] : ["checkout", "transaction confirmation", "payment states"];
  for (const phrase of paymentCopy) assert.ok(servicesBlock.toLowerCase().includes(phrase), `${locale}: payment-gateway offer missing capability: ${phrase}`);
  const evidence = locale === "es" ? ["Ver funciones de pago en ALIA y House Streaming", "Ver Celisapp en proyectos", "Experiencia en mantenimiento de soluciones web"] : ["See payment features in ALIA and House Streaming", "See Celisapp in selected projects", "Experience maintaining web solutions"];
  for (const item of evidence) assert.ok(html.includes(item), `${locale}: existing project or work evidence link missing: ${item}`);
  assert.ok((html.match(/href="#contact"/g) || []).length >= 6, `${locale}: each service needs a contact route`);
  const emittedCss = readdirSync("dist/_astro").filter(file => file.endsWith(".css")).map(file => readFileSync(`dist/_astro/${file}`, "utf8")).join("\\n");
  assert.match(emittedCss, /prefers-reduced-motion/, `${locale}: reduced-motion path missing`);

  assert.ok(emittedCss.includes(".service-card") && emittedCss.includes("grid-template-columns:minmax(0,1fr)") && emittedCss.includes("repeat(3,minmax(0,1fr))") && emittedCss.includes("(width>=1100px)"), `${locale}: stacked mobile and three-column desktop service layout missing`);
  assert.ok(html.includes(locale === "es" ? "Abrir proyecto: ALIA" : "Open project: ALIA"), `${locale}: named project links missing`);
  assert.ok(html.includes(locale === "es" ? "ALIA para reservar sesiones" : "ALIA platform screen for booking sessions"), `${locale}: localized project alt missing`);
  assert.match(html, /(proyecto|project)[\s\S]*(experiencia|experience)[\s\S]*(CV)/i, `${locale}: both audience routes missing`);
}
