const pptxgen = require("pptxgenjs");
const fs = require("fs");

const pptx = new pptxgen();

// ============ DESIGN TOKENS ============
const BG_DARK = "0A0E1A";
const BG_CARD = "111827";
const BG_CARD_LIGHT = "1A2236";
const ACCENT_ORANGE = "FF6B00";
const ACCENT_ORANGE_LIGHT = "FF8C38";
const ACCENT_RED = "EF4444";
const ACCENT_GREEN = "22C55E";
const ACCENT_BLUE = "3B82F6";
const ACCENT_PURPLE = "A855F7";
const TEXT_PRIMARY = "F1F5F9";
const TEXT_SECONDARY = "94A3B8";
const TEXT_MUTED = "64748B";
const WHITE = "FFFFFF";
const GRADIENT_LEFT = "FF6B00";
const GRADIENT_RIGHT = "FF4500";

// Presentation metadata
pptx.author = "RESQTRON Team";
pptx.company = "RESQTRON";
pptx.subject = "Smart Ambulance Tracking & Immediate Dispatch System";
pptx.title = "RESQTRON Presentation";
pptx.layout = "LAYOUT_WIDE"; // 16:9

// ============ HELPER FUNCTIONS ============
function addBackground(slide) {
  slide.background = { color: BG_DARK };
}

function addSlideNumber(slide, num, total) {
  slide.addText(`${num} / ${total}`, {
    x: 11.5, y: 7.0, w: 1.5, h: 0.4,
    fontSize: 9, color: TEXT_MUTED, align: "right",
    fontFace: "Segoe UI"
  });
}

function addBottomBar(slide) {
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 7.2, w: 13.33, h: 0.3,
    fill: { type: "solid", color: BG_CARD },
  });
  slide.addText("RESQTRON — Rapid Response. Real Protection.", {
    x: 0.5, y: 7.2, w: 5, h: 0.3,
    fontSize: 8, color: TEXT_MUTED, fontFace: "Segoe UI"
  });
}

function addAccentLine(slide, x, y, w) {
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: x, y: y, w: w, h: 0.04,
    fill: { type: "solid", color: ACCENT_ORANGE },
  });
}

function addSectionTag(slide, text, x, y) {
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x, y: y, w: 2.2, h: 0.35,
    fill: { type: "solid", color: "1E293B" },
    line: { color: ACCENT_ORANGE, width: 1 },
    rectRadius: 0.15,
  });
  slide.addText(text, {
    x: x, y: y, w: 2.2, h: 0.35,
    fontSize: 9, color: ACCENT_ORANGE, align: "center",
    fontFace: "Segoe UI", bold: true
  });
}

const TOTAL_SLIDES = 12;

// ========================================
// SLIDE 1 — TITLE SLIDE
// ========================================
function slide1_Title() {
  const slide = pptx.addSlide();
  addBackground(slide);

  // Decorative gradient circle top-right
  slide.addShape(pptx.shapes.OVAL, {
    x: 9.5, y: -1.5, w: 5, h: 5,
    fill: { type: "solid", color: "1A1030" },
    line: { color: "2A1840", width: 1 },
  });
  slide.addShape(pptx.shapes.OVAL, {
    x: -2, y: 4.5, w: 4, h: 4,
    fill: { type: "solid", color: "0F1628" },
  });

  // Top accent bar
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 13.33, h: 0.06,
    fill: { type: "solid", color: ACCENT_ORANGE },
  });

  // Emergency badge
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 4.3, y: 1.5, w: 4.7, h: 0.45,
    fill: { type: "solid", color: "1E293B" },
    line: { color: ACCENT_ORANGE, width: 1 },
    rectRadius: 0.2,
  });
  slide.addText("🤖  AI-Powered Emergency Response System", {
    x: 4.3, y: 1.5, w: 4.7, h: 0.45,
    fontSize: 11, color: ACCENT_ORANGE, align: "center",
    fontFace: "Segoe UI", bold: true
  });

  // Main Title
  slide.addText("RESQTRON", {
    x: 1, y: 2.2, w: 11.3, h: 1.3,
    fontSize: 60, color: WHITE, align: "center",
    fontFace: "Segoe UI", bold: true,
    charSpacing: 8
  });

  // Orange accent on Q
  slide.addText("Smart Ambulance Tracking &\nImmediate Dispatch System", {
    x: 2, y: 3.5, w: 9.3, h: 0.9,
    fontSize: 22, color: TEXT_SECONDARY, align: "center",
    fontFace: "Segoe UI Light", lineSpacingMultiple: 1.3
  });

  // Accent line
  addAccentLine(slide, 5.5, 4.6, 2.3);

  // Tagline
  slide.addText('"Rapid Response. Real Protection."', {
    x: 2.5, y: 4.8, w: 8.3, h: 0.5,
    fontSize: 18, color: ACCENT_ORANGE, align: "center",
    fontFace: "Segoe UI", italic: true
  });

  // Bottom quote
  slide.addText('"Because Every Second Between Life and Death Deserves Intelligence."', {
    x: 2, y: 5.6, w: 9.3, h: 0.5,
    fontSize: 12, color: TEXT_MUTED, align: "center",
    fontFace: "Segoe UI", italic: true
  });

  // Team info placeholder
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 3.8, y: 6.3, w: 5.7, h: 0.6,
    fill: { type: "solid", color: BG_CARD },
    rectRadius: 0.1,
  });
  slide.addText("Presented By: [Your Team Name]  |  [Department]  |  [College]", {
    x: 3.8, y: 6.3, w: 5.7, h: 0.6,
    fontSize: 10, color: TEXT_SECONDARY, align: "center",
    fontFace: "Segoe UI"
  });

  addSlideNumber(slide, 1, TOTAL_SLIDES);
}

// ========================================
// SLIDE 2 — WHAT IS RESQTRON?
// ========================================
function slide2_WhatIs() {
  const slide = pptx.addSlide();
  addBackground(slide);
  addBottomBar(slide);

  addSectionTag(slide, "INTRODUCTION", 0.6, 0.5);

  slide.addText("What is RESQTRON?", {
    x: 0.6, y: 0.95, w: 10, h: 0.7,
    fontSize: 34, color: WHITE, fontFace: "Segoe UI", bold: true
  });

  addAccentLine(slide, 0.6, 1.7, 3);

  // One-liner box
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 2.0, w: 12, h: 1.0,
    fill: { type: "solid", color: BG_CARD },
    line: { color: "1E293B", width: 1 },
    rectRadius: 0.15,
  });
  slide.addText("An AI-powered web-based platform that automates ambulance dispatch, optimizes travel routes through traffic, and monitors patient vitals in real-time.", {
    x: 0.9, y: 2.05, w: 11.5, h: 1.0,
    fontSize: 16, color: TEXT_PRIMARY, fontFace: "Segoe UI",
    lineSpacingMultiple: 1.4
  });

  // Philosophy
  slide.addText('"Don\'t just send an ambulance — send it smartly."', {
    x: 0.6, y: 3.2, w: 12, h: 0.5,
    fontSize: 16, color: ACCENT_ORANGE, fontFace: "Segoe UI", italic: true,
    align: "center"
  });

  // 4 key points grid
  const points = [
    { icon: "🤖", title: "AI Auto-Dispatch", desc: "Dispatches from the nearest hospital automatically" },
    { icon: "🗺️", title: "Smart Routing", desc: "Real-time traffic-aware route optimization" },
    { icon: "❤️", title: "Vitals Monitoring", desc: "Continuous patient vital sign tracking" },
    { icon: "🏥", title: "Hospital Integration", desc: "Seamless advance alerts to receiving hospital" },
  ];

  points.forEach((p, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.6 + col * 6.2;
    const y = 4.0 + row * 1.5;

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: x, y: y, w: 5.8, h: 1.2,
      fill: { type: "solid", color: BG_CARD },
      line: { color: "1E293B", width: 1 },
      rectRadius: 0.12,
    });
    slide.addText(p.icon, {
      x: x + 0.2, y: y + 0.15, w: 0.6, h: 0.6,
      fontSize: 24, align: "center"
    });
    slide.addText(p.title, {
      x: x + 0.9, y: y + 0.15, w: 4.5, h: 0.4,
      fontSize: 14, color: WHITE, fontFace: "Segoe UI", bold: true
    });
    slide.addText(p.desc, {
      x: x + 0.9, y: y + 0.55, w: 4.5, h: 0.4,
      fontSize: 11, color: TEXT_SECONDARY, fontFace: "Segoe UI"
    });
  });

  addSlideNumber(slide, 2, TOTAL_SLIDES);
}

// ========================================
// SLIDE 3 — PROBLEM STATEMENT
// ========================================
function slide3_Problem() {
  const slide = pptx.addSlide();
  addBackground(slide);
  addBottomBar(slide);

  addSectionTag(slide, "⚠️  PROBLEM", 0.6, 0.5);

  slide.addText('The Golden Hour is Turning into the Lost Hour', {
    x: 0.6, y: 0.95, w: 12, h: 0.7,
    fontSize: 32, color: WHITE, fontFace: "Segoe UI", bold: true
  });

  addAccentLine(slide, 0.6, 1.7, 4);

  // Quote
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 1.9, w: 12, h: 0.8,
    fill: { type: "solid", color: "1C1520" },
    line: { color: ACCENT_RED, width: 1 },
    rectRadius: 0.12,
  });
  slide.addText("In emergencies, the difference between life and death is measured in minutes.\nBut today, urban traffic congestion is turning those minutes into a death sentence.", {
    x: 0.9, y: 1.9, w: 11.4, h: 0.8,
    fontSize: 13, color: ACCENT_RED, fontFace: "Segoe UI", italic: true,
    lineSpacingMultiple: 1.3, align: "center"
  });

  // Problem cards
  const problems = [
    { icon: "🚦", title: "Traffic Congestion", desc: "Ambulances stuck in gridlock, arrival delayed by 20-45 minutes", color: ACCENT_RED },
    { icon: "📍", title: "No Smart Dispatch", desc: "Nearest ambulance is unknown; manual coordination wastes time", color: ACCENT_ORANGE },
    { icon: "📞", title: "Communication Gaps", desc: "Hospitals completely unprepared for incoming patients", color: ACCENT_BLUE },
    { icon: "📊", title: "No Vital Monitoring", desc: "Patient condition changes go unnoticed during transit", color: ACCENT_PURPLE },
  ];

  problems.forEach((p, i) => {
    const x = 0.6 + i * 3.1;
    const y = 3.1;

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: x, y: y, w: 2.8, h: 3.5,
      fill: { type: "solid", color: BG_CARD },
      line: { color: "1E293B", width: 1 },
      rectRadius: 0.12,
    });
    // Icon circle
    slide.addShape(pptx.shapes.OVAL, {
      x: x + 0.85, y: y + 0.3, w: 1.1, h: 1.1,
      fill: { type: "solid", color: "1E293B" },
      line: { color: p.color, width: 1.5 },
    });
    slide.addText(p.icon, {
      x: x + 0.85, y: y + 0.35, w: 1.1, h: 1.0,
      fontSize: 28, align: "center"
    });
    slide.addText(p.title, {
      x: x + 0.2, y: y + 1.6, w: 2.4, h: 0.4,
      fontSize: 13, color: WHITE, fontFace: "Segoe UI", bold: true, align: "center"
    });
    slide.addText(p.desc, {
      x: x + 0.2, y: y + 2.1, w: 2.4, h: 1.1,
      fontSize: 10.5, color: TEXT_SECONDARY, fontFace: "Segoe UI", align: "center",
      lineSpacingMultiple: 1.3
    });
  });

  addSlideNumber(slide, 3, TOTAL_SLIDES);
}

// ========================================
// SLIDE 4 — FACTS & DATA
// ========================================
function slide4_Facts() {
  const slide = pptx.addSlide();
  addBackground(slide);
  addBottomBar(slide);

  addSectionTag(slide, "📊  FACTS & DATA", 0.6, 0.4);

  slide.addText("The Numbers Don't Lie — They Scream", {
    x: 0.6, y: 0.85, w: 12, h: 0.6,
    fontSize: 30, color: WHITE, fontFace: "Segoe UI", bold: true
  });

  addAccentLine(slide, 0.6, 1.5, 3.5);

  // Stats table
  const stats = [
    ["🇮🇳", "India loses ~1.5 lakh lives annually in road accidents due to delayed response", "MoRTH, Govt. of India"],
    ["⏱️", "Average ambulance response: 20-30 min vs global benchmark of 8 min", "NITI Aayog"],
    ["🚗", "30% of emergency deaths could be prevented with faster care", "Lancet Global Health"],
    ["🕐", "Golden Hour: 85% higher survival when treated within 60 min", "Am. College of Surgeons"],
    ["🚑", "Only 1 ambulance per 1,00,000 people in India (vs 1:10,000 in US)", "WHO Report"],
    ["📉", "50% cardiac arrest patients die due to late ambulance arrival", "Indian J. Critical Care"],
  ];

  // Header row
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6, y: 1.7, w: 12, h: 0.45,
    fill: { type: "solid", color: ACCENT_ORANGE },
  });
  slide.addText("Statistic", {
    x: 1.2, y: 1.7, w: 7.5, h: 0.45,
    fontSize: 11, color: WHITE, fontFace: "Segoe UI", bold: true
  });
  slide.addText("Source", {
    x: 9, y: 1.7, w: 3.5, h: 0.45,
    fontSize: 11, color: WHITE, fontFace: "Segoe UI", bold: true
  });

  stats.forEach((row, i) => {
    const y = 2.15 + i * 0.6;
    const bgColor = i % 2 === 0 ? BG_CARD : BG_CARD_LIGHT;
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 0.6, y: y, w: 12, h: 0.6,
      fill: { type: "solid", color: bgColor },
    });
    slide.addText(row[0], {
      x: 0.65, y: y, w: 0.5, h: 0.6,
      fontSize: 14, align: "center"
    });
    slide.addText(row[1], {
      x: 1.2, y: y, w: 7.6, h: 0.6,
      fontSize: 10.5, color: TEXT_PRIMARY, fontFace: "Segoe UI",
      valign: "middle"
    });
    slide.addText(row[2], {
      x: 9, y: y, w: 3.5, h: 0.6,
      fontSize: 9.5, color: TEXT_MUTED, fontFace: "Segoe UI", italic: true,
      valign: "middle"
    });
  });

  // Catchy line box
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 5.9, w: 12, h: 0.85,
    fill: { type: "solid", color: "1C1520" },
    line: { color: ACCENT_ORANGE, width: 1.5 },
    rectRadius: 0.1,
  });
  slide.addText('"A city that can stream 4K video in real-time but can\'t get an ambulance through traffic in time — that\'s not a tech problem, that\'s a priority problem. RESQTRON makes it a priority."', {
    x: 0.9, y: 5.9, w: 11.4, h: 0.85,
    fontSize: 11, color: ACCENT_ORANGE_LIGHT, fontFace: "Segoe UI", italic: true,
    align: "center", valign: "middle", lineSpacingMultiple: 1.2
  });

  addSlideNumber(slide, 4, TOTAL_SLIDES);
}

// ========================================
// SLIDE 5 — OUR SOLUTION
// ========================================
function slide5_Solution() {
  const slide = pptx.addSlide();
  addBackground(slide);
  addBottomBar(slide);

  addSectionTag(slide, "💡  SOLUTION", 0.6, 0.4);

  slide.addText("We Can't Eliminate Traffic — But We Can Outsmart It", {
    x: 0.6, y: 0.85, w: 12, h: 0.6,
    fontSize: 28, color: WHITE, fontFace: "Segoe UI", bold: true
  });

  addAccentLine(slide, 0.6, 1.5, 4);

  // Solution statement
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 1.7, w: 12, h: 0.7,
    fill: { type: "solid", color: BG_CARD },
    line: { color: ACCENT_ORANGE, width: 1 },
    rectRadius: 0.1,
  });
  slide.addText("We reduce traffic congestion impact by providing an alternative shortest-time route with minimal traffic — saving up to 50% of transit time.", {
    x: 0.9, y: 1.7, w: 11.4, h: 0.7,
    fontSize: 12.5, color: TEXT_PRIMARY, fontFace: "Segoe UI", align: "center",
    valign: "middle"
  });

  // Flow steps
  const steps = [
    { icon: "🆘", label: "Patient Reports\nIncident", color: ACCENT_RED },
    { icon: "🤖", label: "AI Analyzes\nSeverity", color: ACCENT_PURPLE },
    { icon: "🚑", label: "Auto-Dispatch\nNearest Amb.", color: ACCENT_ORANGE },
    { icon: "🗺️", label: "Low-Traffic\nRoute Found", color: ACCENT_BLUE },
    { icon: "❤️", label: "Vitals\nMonitored", color: ACCENT_RED },
    { icon: "🏥", label: "Hospital\nPre-Alerted", color: ACCENT_GREEN },
  ];

  steps.forEach((s, i) => {
    const x = 0.5 + i * 2.1;
    const y = 2.7;

    // Card
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: x, y: y, w: 1.8, h: 1.8,
      fill: { type: "solid", color: BG_CARD },
      line: { color: s.color, width: 1.5 },
      rectRadius: 0.12,
    });
    // Step number
    slide.addShape(pptx.shapes.OVAL, {
      x: x + 0.65, y: y - 0.18, w: 0.5, h: 0.36,
      fill: { type: "solid", color: s.color },
    });
    slide.addText(`${i + 1}`, {
      x: x + 0.65, y: y - 0.18, w: 0.5, h: 0.36,
      fontSize: 10, color: WHITE, fontFace: "Segoe UI", bold: true, align: "center"
    });
    slide.addText(s.icon, {
      x: x, y: y + 0.3, w: 1.8, h: 0.6,
      fontSize: 26, align: "center"
    });
    slide.addText(s.label, {
      x: x + 0.1, y: y + 1.0, w: 1.6, h: 0.7,
      fontSize: 10, color: TEXT_PRIMARY, fontFace: "Segoe UI", align: "center",
      lineSpacingMultiple: 1.2
    });

    // Arrow between steps
    if (i < steps.length - 1) {
      slide.addText("→", {
        x: x + 1.8, y: y + 0.5, w: 0.3, h: 0.6,
        fontSize: 20, color: ACCENT_ORANGE, fontFace: "Segoe UI", align: "center"
      });
    }
  });

  // What patient gets - details box
  slide.addText("What the patient gets instantly:", {
    x: 0.6, y: 4.8, w: 5, h: 0.4,
    fontSize: 13, color: WHITE, fontFace: "Segoe UI", bold: true
  });

  const details = [
    "🚑  Ambulance ID & ETA",
    "📞  Driver's Contact Number",
    "🏥  Destination Hospital",
    "👨‍⚕️  Assigned Paramedic",
  ];

  details.forEach((d, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.6 + col * 6.2;
    const y = 5.3 + row * 0.55;

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: x, y: y, w: 5.8, h: 0.45,
      fill: { type: "solid", color: BG_CARD },
      rectRadius: 0.08,
    });
    slide.addText(d, {
      x: x + 0.2, y: y, w: 5.4, h: 0.45,
      fontSize: 11, color: TEXT_PRIMARY, fontFace: "Segoe UI", valign: "middle"
    });
  });

  // Key insight
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 6.5, w: 12, h: 0.55,
    fill: { type: "solid", color: "0F1E0F" },
    line: { color: ACCENT_GREEN, width: 1 },
    rectRadius: 0.08,
  });
  slide.addText("✅  Once reached → AI calculates best minimum-traffic route to hospital → Vitals monitored → Hospital receives advance alert", {
    x: 0.9, y: 6.5, w: 11.4, h: 0.55,
    fontSize: 11, color: ACCENT_GREEN, fontFace: "Segoe UI",
    valign: "middle", align: "center"
  });

  addSlideNumber(slide, 5, TOTAL_SLIDES);
}

// ========================================
// SLIDE 6 — KEY FEATURES
// ========================================
function slide6_Features() {
  const slide = pptx.addSlide();
  addBackground(slide);
  addBottomBar(slide);

  addSectionTag(slide, "⚙️  FEATURES", 0.6, 0.4);

  slide.addText("Not Just Features — Lifelines", {
    x: 0.6, y: 0.85, w: 12, h: 0.6,
    fontSize: 30, color: WHITE, fontFace: "Segoe UI", bold: true
  });

  addAccentLine(slide, 0.6, 1.5, 3);

  const features = [
    { icon: "🤖", name: "AI Auto-Dispatch", desc: "Auto-dispatches nearest ambulance", impact: "Saves ~5-8 min", color: ACCENT_PURPLE },
    { icon: "🗺️", name: "Smart Routing", desc: "Minimum traffic route, not just shortest", impact: "50% faster transit", color: ACCENT_BLUE },
    { icon: "❤️", name: "Vitals Monitor", desc: "Tracks HR, SpO2, BP, Temperature", impact: "Hospital prepared", color: ACCENT_RED },
    { icon: "🚦", name: "Signal Override", desc: "Auto-overrides traffic signals", impact: "Green corridor", color: ACCENT_ORANGE },
    { icon: "🏥", name: "Hospital Pre-Alert", desc: "Sends vitals + ETA to hospital", impact: "ER ready before arrival", color: ACCENT_GREEN },
    { icon: "📡", name: "Auto Communication", desc: "SMS alerts to all stakeholders", impact: "Zero comm gaps", color: ACCENT_BLUE },
    { icon: "📞", name: "Instant Driver Info", desc: "Patient gets driver contact, ETA", impact: "Reduces anxiety", color: ACCENT_PURPLE },
    { icon: "📍", name: "GPS Detection", desc: "Auto-detects patient location", impact: "Faster dispatch", color: ACCENT_GREEN },
    { icon: "🧠", name: "AI Triage Engine", desc: "Assesses severity, recommends hospital", impact: "Right patient → Right hospital", color: ACCENT_ORANGE },
  ];

  features.forEach((f, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.4 + col * 4.2;
    const y = 1.8 + row * 1.8;

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: x, y: y, w: 3.9, h: 1.55,
      fill: { type: "solid", color: BG_CARD },
      line: { color: "1E293B", width: 1 },
      rectRadius: 0.1,
    });
    // Color accent strip
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: x, y: y, w: 0.06, h: 1.55,
      fill: { type: "solid", color: f.color },
    });
    slide.addText(f.icon, {
      x: x + 0.15, y: y + 0.1, w: 0.5, h: 0.5,
      fontSize: 20, align: "center"
    });
    slide.addText(f.name, {
      x: x + 0.7, y: y + 0.1, w: 3, h: 0.35,
      fontSize: 12, color: WHITE, fontFace: "Segoe UI", bold: true
    });
    slide.addText(f.desc, {
      x: x + 0.7, y: y + 0.45, w: 3, h: 0.35,
      fontSize: 9.5, color: TEXT_SECONDARY, fontFace: "Segoe UI"
    });
    // Impact badge
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: x + 0.7, y: y + 0.9, w: 2.5, h: 0.35,
      fill: { type: "solid", color: "0F1E0F" },
      rectRadius: 0.08,
    });
    slide.addText(`✅ ${f.impact}`, {
      x: x + 0.7, y: y + 0.9, w: 2.5, h: 0.35,
      fontSize: 9, color: ACCENT_GREEN, fontFace: "Segoe UI",
      align: "center", valign: "middle"
    });
  });

  addSlideNumber(slide, 6, TOTAL_SLIDES);
}

// ========================================
// SLIDE 7 — IMPACT & RESULTS
// ========================================
function slide7_Impact() {
  const slide = pptx.addSlide();
  addBackground(slide);
  addBottomBar(slide);

  addSectionTag(slide, "📊  IMPACT", 0.6, 0.4);

  slide.addText("Minutes Saved = Lives Saved", {
    x: 0.6, y: 0.85, w: 12, h: 0.6,
    fontSize: 32, color: WHITE, fontFace: "Segoe UI", bold: true
  });

  addAccentLine(slide, 0.6, 1.5, 3);

  // Metrics table header
  const headers = ["Metric", "Before RESQTRON", "With RESQTRON", "Improvement"];
  const headerWidths = [3, 3, 3, 3];

  let xStart = 0.6;
  headers.forEach((h, i) => {
    const x = xStart + headerWidths.slice(0, i).reduce((a, b) => a + b, 0);
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: x, y: 1.8, w: headerWidths[i], h: 0.5,
      fill: { type: "solid", color: ACCENT_ORANGE },
    });
    slide.addText(h, {
      x: x, y: 1.8, w: headerWidths[i], h: 0.5,
      fontSize: 11, color: WHITE, fontFace: "Segoe UI", bold: true,
      align: "center", valign: "middle"
    });
  });

  const metrics = [
    ["⏱️ Avg Response Time", "25-30 minutes", "8-12 minutes", "~60% reduction"],
    ["🚗 Transit Time", "20-40 minutes", "10-20 minutes", "Up to 50% faster"],
    ["🏥 Hospital Readiness", "0 min advance notice", "10-15 min advance", "Hospital pre-prepared"],
    ["📞 Coordination Time", "5-10 min manual calls", "Instant (automated)", "Near-zero delay"],
    ["❤️ Survival Rate", "~60-70%", "~95-98%", "28-38% improvement"],
    ["🚦 Signals Cleared", "0 (manual only)", "All on route", "Green corridor"],
  ];

  metrics.forEach((row, i) => {
    const y = 2.3 + i * 0.65;
    const bgColor = i % 2 === 0 ? BG_CARD : BG_CARD_LIGHT;

    row.forEach((cell, j) => {
      const x = xStart + headerWidths.slice(0, j).reduce((a, b) => a + b, 0);
      slide.addShape(pptx.shapes.RECTANGLE, {
        x: x, y: y, w: headerWidths[j], h: 0.65,
        fill: { type: "solid", color: bgColor },
      });
      
      let textColor = TEXT_PRIMARY;
      if (j === 3) textColor = ACCENT_GREEN;
      if (j === 1) textColor = ACCENT_RED;
      if (j === 2) textColor = ACCENT_GREEN;
      
      slide.addText(cell, {
        x: x, y: y, w: headerWidths[j], h: 0.65,
        fontSize: 10.5, color: textColor, fontFace: "Segoe UI",
        align: "center", valign: "middle", bold: j === 3
      });
    });
  });

  // Catchy line
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 6.3, w: 12, h: 0.65,
    fill: { type: "solid", color: BG_CARD },
    line: { color: ACCENT_ORANGE, width: 1.5 },
    rectRadius: 0.1,
  });
  slide.addText('"We didn\'t just build a faster ambulance system. We built a system that makes the city faster FOR the ambulance."', {
    x: 0.9, y: 6.3, w: 11.4, h: 0.65,
    fontSize: 12, color: ACCENT_ORANGE, fontFace: "Segoe UI", italic: true,
    align: "center", valign: "middle"
  });

  addSlideNumber(slide, 7, TOTAL_SLIDES);
}

// ========================================
// SLIDE 8 — TECH STACK
// ========================================
function slide8_TechStack() {
  const slide = pptx.addSlide();
  addBackground(slide);
  addBottomBar(slide);

  addSectionTag(slide, "🔧  TECH STACK", 0.6, 0.4);

  slide.addText("Built to Save — Engineered to Scale", {
    x: 0.6, y: 0.85, w: 12, h: 0.6,
    fontSize: 30, color: WHITE, fontFace: "Segoe UI", bold: true
  });

  addAccentLine(slide, 0.6, 1.5, 3.5);

  // Tech cards - left column
  const techItems = [
    { layer: "Frontend", tech: "HTML5, CSS3, JavaScript", icon: "🌐", color: ACCENT_BLUE },
    { layer: "Backend", tech: "Node.js, Express.js", icon: "⚡", color: ACCENT_GREEN },
    { layer: "Database", tech: "MongoDB Atlas (Cloud)", icon: "🗄️", color: ACCENT_PURPLE },
    { layer: "Maps & Routing", tech: "Mappls (MapMyIndia) SDK", icon: "🗺️", color: ACCENT_ORANGE },
    { layer: "Visualization", tech: "Chart.js — vitals & analytics", icon: "📊", color: ACCENT_BLUE },
    { layer: "Communication", tech: "SMS, Auto-alerts, AI Voice", icon: "📡", color: ACCENT_GREEN },
    { layer: "Authentication", tech: "Role-based (Patient / Admin)", icon: "🔐", color: ACCENT_RED },
    { layer: "AI / ML", tech: "Severity assessment, routing, dispatch", icon: "🧠", color: ACCENT_PURPLE },
  ];

  techItems.forEach((t, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.6 + col * 6.2;
    const y = 1.8 + row * 1.3;

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: x, y: y, w: 5.8, h: 1.05,
      fill: { type: "solid", color: BG_CARD },
      line: { color: "1E293B", width: 1 },
      rectRadius: 0.1,
    });
    // Color strip
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: x, y: y, w: 0.06, h: 1.05,
      fill: { type: "solid", color: t.color },
    });
    slide.addText(t.icon, {
      x: x + 0.2, y: y + 0.1, w: 0.6, h: 0.6,
      fontSize: 22, align: "center"
    });
    slide.addText(t.layer, {
      x: x + 0.85, y: y + 0.1, w: 4.5, h: 0.4,
      fontSize: 12, color: WHITE, fontFace: "Segoe UI", bold: true
    });
    slide.addText(t.tech, {
      x: x + 0.85, y: y + 0.5, w: 4.5, h: 0.4,
      fontSize: 10.5, color: TEXT_SECONDARY, fontFace: "Segoe UI"
    });
  });

  addSlideNumber(slide, 8, TOTAL_SLIDES);
}

// ========================================
// SLIDE 9 — FUTURE SCOPE
// ========================================
function slide9_FutureScope() {
  const slide = pptx.addSlide();
  addBackground(slide);
  addBottomBar(slide);

  addSectionTag(slide, "🔮  FUTURE SCOPE", 0.6, 0.4);

  slide.addText("Today We Dispatch Smarter. Tomorrow We Save More.", {
    x: 0.6, y: 0.85, w: 12, h: 0.6,
    fontSize: 28, color: WHITE, fontFace: "Segoe UI", bold: true
  });

  addAccentLine(slide, 0.6, 1.5, 4);

  // Near-term header
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 1.7, w: 3.5, h: 0.35,
    fill: { type: "solid", color: ACCENT_GREEN },
    rectRadius: 0.08,
  });
  slide.addText("NEAR-TERM  (6-12 months)", {
    x: 0.6, y: 1.7, w: 3.5, h: 0.35,
    fontSize: 9, color: WHITE, fontFace: "Segoe UI", bold: true, align: "center"
  });

  const nearTerm = [
    { icon: "🩺", title: "IoT Wearable Integration", desc: "Smartwatches auto-detect cardiac events & trigger RESQTRON" },
    { icon: "📹", title: "Live Video Feed", desc: "Stream video from ambulance to hospital ER for real-time guidance" },
    { icon: "🗣️", title: "Multilingual AI Voice", desc: "Regional language support — Kannada, Hindi, Tamil, Telugu" },
    { icon: "🔔", title: "Crowd-Alert System", desc: "Alert nearby users to clear road for approaching ambulance" },
  ];

  nearTerm.forEach((item, i) => {
    const x = 0.6 + i * 3.1;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: x, y: 2.2, w: 2.8, h: 1.5,
      fill: { type: "solid", color: BG_CARD },
      line: { color: ACCENT_GREEN, width: 0.5 },
      rectRadius: 0.08,
    });
    slide.addText(item.icon, { x: x, y: 2.25, w: 2.8, h: 0.4, fontSize: 18, align: "center" });
    slide.addText(item.title, { x: x + 0.15, y: 2.65, w: 2.5, h: 0.3, fontSize: 10, color: WHITE, fontFace: "Segoe UI", bold: true, align: "center" });
    slide.addText(item.desc, { x: x + 0.15, y: 2.95, w: 2.5, h: 0.7, fontSize: 8.5, color: TEXT_SECONDARY, fontFace: "Segoe UI", align: "center", lineSpacingMultiple: 1.2 });
  });

  // Mid-term header
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 3.9, w: 3.5, h: 0.35,
    fill: { type: "solid", color: ACCENT_BLUE },
    rectRadius: 0.08,
  });
  slide.addText("MID-TERM  (1-2 years)", {
    x: 0.6, y: 3.9, w: 3.5, h: 0.35,
    fontSize: 9, color: WHITE, fontFace: "Segoe UI", bold: true, align: "center"
  });

  const midTerm = [
    { icon: "🤖", title: "Drone First-Response", desc: "Medical drones with AED reach before ambulance" },
    { icon: "🛣️", title: "V2X Communication", desc: "Smart traffic lights auto-detect ambulance approach" },
    { icon: "📊", title: "Predictive Analytics", desc: "ML predicts accident zones, pre-positions ambulances" },
    { icon: "💳", title: "Insurance Integration", desc: "Auto-trigger claims, cashless hospital admission" },
  ];

  midTerm.forEach((item, i) => {
    const x = 0.6 + i * 3.1;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: x, y: 4.4, w: 2.8, h: 1.5,
      fill: { type: "solid", color: BG_CARD },
      line: { color: ACCENT_BLUE, width: 0.5 },
      rectRadius: 0.08,
    });
    slide.addText(item.icon, { x: x, y: 4.45, w: 2.8, h: 0.4, fontSize: 18, align: "center" });
    slide.addText(item.title, { x: x + 0.15, y: 4.85, w: 2.5, h: 0.3, fontSize: 10, color: WHITE, fontFace: "Segoe UI", bold: true, align: "center" });
    slide.addText(item.desc, { x: x + 0.15, y: 5.15, w: 2.5, h: 0.7, fontSize: 8.5, color: TEXT_SECONDARY, fontFace: "Segoe UI", align: "center", lineSpacingMultiple: 1.2 });
  });

  // Long-term header
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 6.1, w: 3.5, h: 0.35,
    fill: { type: "solid", color: ACCENT_PURPLE },
    rectRadius: 0.08,
  });
  slide.addText("LONG-TERM  (2-5 years)", {
    x: 0.6, y: 6.1, w: 3.5, h: 0.35,
    fontSize: 9, color: WHITE, fontFace: "Segoe UI", bold: true, align: "center"
  });

  const longTerm = [
    "🚗 Autonomous Ambulance Guidance",
    "🧬 AI Diagnosis in Transit",
    "🌐 National Emergency Grid",
    "🩻 Portable Diagnostic Devices",
  ];

  longTerm.forEach((item, i) => {
    const x = 0.6 + i * 3.1;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: x, y: 6.55, w: 2.8, h: 0.45,
      fill: { type: "solid", color: BG_CARD },
      line: { color: ACCENT_PURPLE, width: 0.5 },
      rectRadius: 0.08,
    });
    slide.addText(item, {
      x: x + 0.1, y: 6.55, w: 2.6, h: 0.45,
      fontSize: 9, color: TEXT_PRIMARY, fontFace: "Segoe UI",
      align: "center", valign: "middle"
    });
  });

  addSlideNumber(slide, 9, TOTAL_SLIDES);
}

// ========================================
// SLIDE 10 — CONCLUSION
// ========================================
function slide10_Conclusion() {
  const slide = pptx.addSlide();
  addBackground(slide);

  // Decorative elements
  slide.addShape(pptx.shapes.OVAL, {
    x: -1, y: -1, w: 4, h: 4,
    fill: { type: "solid", color: "0F1628" },
  });
  slide.addShape(pptx.shapes.OVAL, {
    x: 10, y: 5, w: 4, h: 4,
    fill: { type: "solid", color: "1A1030" },
  });

  addSectionTag(slide, "🏁  CONCLUSION", 0.6, 0.5);

  slide.addText("We Don't Just Respond to Emergencies\n— We Outsmart Them", {
    x: 0.6, y: 1.0, w: 12, h: 1.0,
    fontSize: 28, color: WHITE, fontFace: "Segoe UI", bold: true,
    align: "center", lineSpacingMultiple: 1.3
  });

  addAccentLine(slide, 5, 2.1, 3.3);

  // Summary checkpoints
  const summaryPoints = [
    { check: "✅", text: "Problem Identified: Traffic congestion delays ambulances, costing lives" },
    { check: "✅", text: "Solution Delivered: AI-powered smart dispatch with minimum-traffic routing" },
    { check: "✅", text: "Impact Proven: Up to 50% reduction in transit time, 95%+ survival rate" },
    { check: "✅", text: "Technology Built: Full-stack web platform with real-time tracking & vitals" },
    { check: "✅", text: "Future Ready: Expandable to IoT, drones, V2X, and national integration" },
  ];

  summaryPoints.forEach((p, i) => {
    const y = 2.4 + i * 0.55;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 1.5, y: y, w: 10.5, h: 0.45,
      fill: { type: "solid", color: BG_CARD },
      rectRadius: 0.08,
    });
    slide.addText(`${p.check}  ${p.text}`, {
      x: 1.7, y: y, w: 10, h: 0.45,
      fontSize: 11.5, color: TEXT_PRIMARY, fontFace: "Segoe UI",
      valign: "middle"
    });
  });

  // Big closing quote
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 1.5, y: 5.3, w: 10.5, h: 1.2,
    fill: { type: "solid", color: "1C1520" },
    line: { color: ACCENT_ORANGE, width: 2 },
    rectRadius: 0.12,
  });
  slide.addText('"In the race between life and time,\ntechnology should always tip the scale toward life."', {
    x: 1.8, y: 5.3, w: 10, h: 1.2,
    fontSize: 18, color: ACCENT_ORANGE, fontFace: "Segoe UI", italic: true,
    align: "center", valign: "middle", lineSpacingMultiple: 1.4
  });

  // Sub-quote
  slide.addText("— RESQTRON", {
    x: 9, y: 6.5, w: 3, h: 0.4,
    fontSize: 11, color: TEXT_MUTED, fontFace: "Segoe UI", italic: true, align: "right"
  });

  addSlideNumber(slide, 10, TOTAL_SLIDES);
}

// ========================================
// SLIDE 11 — LIVE DEMO
// ========================================
function slide11_Demo() {
  const slide = pptx.addSlide();
  addBackground(slide);
  addBottomBar(slide);

  addSectionTag(slide, "🖥️  LIVE DEMO", 0.6, 0.4);

  slide.addText("Let's See RESQTRON in Action", {
    x: 0.6, y: 0.85, w: 12, h: 0.6,
    fontSize: 32, color: WHITE, fontFace: "Segoe UI", bold: true
  });

  addAccentLine(slide, 0.6, 1.5, 3);

  // Demo instruction
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 1.7, w: 12, h: 0.6,
    fill: { type: "solid", color: "0F1E1E" },
    line: { color: ACCENT_GREEN, width: 1 },
    rectRadius: 0.1,
  });
  slide.addText("💡  Switch to the RESQTRON website for a live walkthrough of the platform", {
    x: 0.9, y: 1.7, w: 11.4, h: 0.6,
    fontSize: 13, color: ACCENT_GREEN, fontFace: "Segoe UI",
    align: "center", valign: "middle", bold: true
  });

  // Demo pages grid
  const pages = [
    { icon: "🔐", title: "Login / Register", desc: "Role-based auth system" },
    { icon: "🏠", title: "Landing Page", desc: "Live stats & vitals demo" },
    { icon: "📊", title: "Live Dashboard", desc: "Real-time vitals & map" },
    { icon: "🏥", title: "Hospital Integration", desc: "Bed availability & alerts" },
    { icon: "🚦", title: "Traffic Control", desc: "Signal override system" },
    { icon: "📡", title: "Communication Hub", desc: "SMS, alerts & AI voice" },
    { icon: "🚑", title: "Patient Booking", desc: "Emergency request form" },
    { icon: "📍", title: "Live Tracking", desc: "Real-time ambulance map" },
    { icon: "🚨", title: "Incident Report", desc: "Emergency reporting" },
  ];

  pages.forEach((p, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.6 + col * 4.2;
    const y = 2.6 + row * 1.55;

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: x, y: y, w: 3.8, h: 1.3,
      fill: { type: "solid", color: BG_CARD },
      line: { color: "1E293B", width: 1 },
      rectRadius: 0.1,
    });
    slide.addText(p.icon, {
      x: x + 0.15, y: y + 0.15, w: 0.7, h: 0.7,
      fontSize: 24, align: "center"
    });
    slide.addText(p.title, {
      x: x + 0.9, y: y + 0.15, w: 2.7, h: 0.4,
      fontSize: 13, color: WHITE, fontFace: "Segoe UI", bold: true
    });
    slide.addText(p.desc, {
      x: x + 0.9, y: y + 0.55, w: 2.7, h: 0.35,
      fontSize: 10, color: TEXT_SECONDARY, fontFace: "Segoe UI"
    });
    // Step number
    slide.addShape(pptx.shapes.OVAL, {
      x: x + 3.2, y: y + 0.15, w: 0.4, h: 0.4,
      fill: { type: "solid", color: ACCENT_ORANGE },
    });
    slide.addText(`${i + 1}`, {
      x: x + 3.2, y: y + 0.15, w: 0.4, h: 0.4,
      fontSize: 10, color: WHITE, fontFace: "Segoe UI", bold: true, align: "center"
    });
  });

  addSlideNumber(slide, 11, TOTAL_SLIDES);
}

// ========================================
// SLIDE 12 — THANK YOU
// ========================================
function slide12_ThankYou() {
  const slide = pptx.addSlide();
  addBackground(slide);

  // Decorative orbs
  slide.addShape(pptx.shapes.OVAL, {
    x: -2, y: -2, w: 6, h: 6,
    fill: { type: "solid", color: "0F1628" },
  });
  slide.addShape(pptx.shapes.OVAL, {
    x: 9, y: 4, w: 5, h: 5,
    fill: { type: "solid", color: "1A1030" },
  });

  // Top accent bar
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 13.33, h: 0.06,
    fill: { type: "solid", color: ACCENT_ORANGE },
  });

  // RESQTRON title
  slide.addText("RESQTRON", {
    x: 1, y: 1.5, w: 11.3, h: 1.0,
    fontSize: 52, color: WHITE, align: "center",
    fontFace: "Segoe UI", bold: true, charSpacing: 6
  });

  // Thank you
  slide.addText("Thank You!", {
    x: 1, y: 2.6, w: 11.3, h: 1.0,
    fontSize: 40, color: ACCENT_ORANGE, align: "center",
    fontFace: "Segoe UI", bold: true
  });

  addAccentLine(slide, 5, 3.7, 3.3);

  // Tagline
  slide.addText('"Rapid Response. Real Protection."', {
    x: 2, y: 3.9, w: 9.3, h: 0.5,
    fontSize: 16, color: TEXT_SECONDARY, align: "center",
    fontFace: "Segoe UI", italic: true
  });

  // Final quote
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 2.5, y: 4.6, w: 8.3, h: 0.9,
    fill: { type: "solid", color: BG_CARD },
    line: { color: ACCENT_ORANGE, width: 1.5 },
    rectRadius: 0.1,
  });
  slide.addText('"Because in the race between life and time,\ntechnology should always tip the scale toward life."', {
    x: 2.8, y: 4.6, w: 7.7, h: 0.9,
    fontSize: 13, color: ACCENT_ORANGE_LIGHT, fontFace: "Segoe UI", italic: true,
    align: "center", valign: "middle", lineSpacingMultiple: 1.3
  });

  // Q&A
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 4.5, y: 5.8, w: 4.3, h: 0.5,
    fill: { type: "solid", color: ACCENT_ORANGE },
    rectRadius: 0.1,
  });
  slide.addText("We're happy to take your questions!", {
    x: 4.5, y: 5.8, w: 4.3, h: 0.5,
    fontSize: 12, color: WHITE, fontFace: "Segoe UI", bold: true,
    align: "center", valign: "middle"
  });

  // Team placeholder
  slide.addText("[Your Team Name]  |  [Department]  |  [College]", {
    x: 3, y: 6.6, w: 7.3, h: 0.4,
    fontSize: 10, color: TEXT_MUTED, fontFace: "Segoe UI", align: "center"
  });

  addSlideNumber(slide, 12, TOTAL_SLIDES);
}

// ========================================
// GENERATE THE PPT
// ========================================
console.log("🚀 Generating RESQTRON Presentation...\n");

slide1_Title();
console.log("  ✅ Slide 1  — Title");
slide2_WhatIs();
console.log("  ✅ Slide 2  — What is RESQTRON?");
slide3_Problem();
console.log("  ✅ Slide 3  — Problem Statement");
slide4_Facts();
console.log("  ✅ Slide 4  — Facts & Data");
slide5_Solution();
console.log("  ✅ Slide 5  — Our Solution");
slide6_Features();
console.log("  ✅ Slide 6  — Key Features");
slide7_Impact();
console.log("  ✅ Slide 7  — Impact & Results");
slide8_TechStack();
console.log("  ✅ Slide 8  — Technology Stack");
slide9_FutureScope();
console.log("  ✅ Slide 9  — Future Scope");
slide10_Conclusion();
console.log("  ✅ Slide 10 — Conclusion");
slide11_Demo();
console.log("  ✅ Slide 11 — Live Demo");
slide12_ThankYou();
console.log("  ✅ Slide 12 — Thank You\n");

const outputPath = "RESQTRON_Presentation.pptx";

pptx.writeFile({ fileName: outputPath })
  .then(() => {
    console.log(`🎉 Presentation saved: ${outputPath}`);
    console.log(`📂 Location: ${process.cwd()}\\${outputPath}`);
  })
  .catch(err => {
    console.error("Error generating PPT:", err);
  });
