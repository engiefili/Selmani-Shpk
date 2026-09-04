# Tanks & Containers — product image prompts

For the homepage's "Tanks & Containers" section. Each list item can now carry
its own image in Sanity — click it and the big frame swaps to match. All 4
prompts below are written to the same style so it's worth generating them
together in one sitting for consistency, rather than one at a time.

## Specs (apply to all)

- **Aspect ratio:** square (1:1) — e.g. 1600×1600px or larger
- **Format:** PNG with a transparent background (no baked-in backdrop) — the
  frame on the site now supplies its own dark gradient background in CSS, so
  the tank itself needs to be cut out. This also means each image can be
  `object-contain`-fit and resized cleanly at any screen size instead of
  being cropped, since there's no fixed background to preserve.
- **Style:** clean 3D product render, moderate detail — realistic enough to
  read clearly as its own product, but not hyper-detailed/photoreal. Soft,
  mostly even lighting baked onto the object itself (not the dramatic
  rim-lit look). Each tank should keep 1–2 features that make it obviously
  different from the others — otherwise they all blur together.

## Getting a transparent background

If your image tool can output transparency directly, ask for it in the
prompt (see below). If not — most can't reliably — generate on a plain,
high-contrast solid background (flat white works best) and cut it out
after: many tools have a built-in "remove background" action, or use
remove.bg / Photoshop's subject-select. Aim for a clean, hard edge with no
leftover halo or background sliver around the tank.

## Shared style prefix

Paste this before each product description below, or just describe the
product and add these style notes at the end — either works, most tools
handle it fine either way.

```
Clean 3D product render, moderate detail — not hyper-photorealistic,
but not flat/featureless either. Matte-to-semi-gloss metal surface with
light, subtle texture (avoid heavy fine-grain noise or weathering).
Transparent background (or, if that's not supported, a plain flat white
background so it can be cut out afterward) — no studio backdrop, no
floor, no gradient. Soft, mostly-even lighting on the object itself,
with only a gentle highlight — avoid strong dramatic rim lighting or
sharp hot specular highlights. Three-quarter angle view, centered
composition, soft contact shadow directly under the object only. No
text, no logos, no people, no background props. Square 1:1 image,
sharp focus.
```

## 1. Hot Dip Galvanized Sanitary Water Tanks

```
A large horizontal cylindrical galvanized steel water tank, mounted on
simple angled cross-braced support legs (not a full rectangular skid
frame). Include a round inspection hatch with a hinge/handle on top,
and one small vent cap near one end — just enough to read clearly as a
sanitary water tank (no valve, no gauge, no piping). Plain galvanized
steel finish, no paint, no branding.
```

## 2. Fuel Tanks

```
A large horizontal cylindrical steel fuel storage tank on a simple
welded steel skid/cradle base with short support legs. Include a
single fill/vent cap on top and one small discharge valve at one end
— just enough hardware to read clearly as a fuel tank, nothing more
(no gauge, no chain, no multi-pipe cluster). Plain galvanized steel
finish, no paint, no branding.
```

## 3. Stainless Steel Containers

```
An upright cylindrical stainless-steel mixing vessel / food-grade
container, with a slightly domed or conical bottom, a simple hinged
lid on top, and short support legs. Semi-gloss polished stainless
steel surface (brighter and cooler-toned than galvanized steel), with
faint visible seam lines — enough to read clearly as stainless, not
galvanized. Simple food-industry vessel shape.
```

## 4. HVAC Storage Tanks & Boilers

```
An upright cylindrical steel accumulator/buffer tank (HVAC boiler
style), standing on a simple round base. Plain matte grey exterior,
with one or two pipe connections near the top and a single small
pressure gauge — just enough to read clearly as HVAC/boiler equipment,
nothing more (no valve cluster). Clean, vertical tank shape.
```

## After generating

Upload each image in Sanity Studio → Home Page → "Tanks & Containers
(homepage teaser)" → the matching item under "Tanks" → new "Image" field.
Leave the alt text field with a short plain description (e.g. "Galvanized
steel fuel tank on a skid base").

For the water tank specifically: its item doesn't have its own image set
yet (it currently falls back to the section's main image above the list),
so uploading one there is what makes it consistent with the other three —
you can also swap the section's main image at the same time if you want the
very first thing visitors see to match too. Changes go live within seconds
— no deploy needed.
