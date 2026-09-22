from __future__ import annotations

import json
from pathlib import Path
from textwrap import wrap

from reportlab.lib.colors import Color, HexColor, black, white
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "tmp" / "pdfs" / "curriculum.json"
OUTPUT_PATH = ROOT / "output" / "pdf" / "full-stack-readiness-checklist.pdf"
LOGO_PATH = ROOT / "client" / "public" / "di-logo.png"

PAGE_W, PAGE_H = A4
MARGIN = 42
RED = HexColor("#E52821")
RED_DARK = HexColor("#B71D18")
INK = HexColor("#111111")
MUTED = HexColor("#66615D")
LINE = HexColor("#DEDAD5")
PAPER = HexColor("#F4F2EF")
GREEN = HexColor("#1C8B5F")
CODE_BG = HexColor("#171717")


def clean(text: str) -> str:
    return text.replace("→", "to").replace("–", "-").replace("—", "-").replace("’", "'").replace("“", '"').replace("”", '"')


def lines_for(text: str, font: str, size: float, width: float) -> list[str]:
    words = clean(text).split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = word if not current else f"{current} {word}"
        if stringWidth(candidate, font, size) <= width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def draw_lines(pdf: canvas.Canvas, text: str, x: float, y: float, width: float, font: str = "Helvetica", size: float = 9, leading: float = 13, color=INK) -> float:
    pdf.setFont(font, size)
    pdf.setFillColor(color)
    for line in lines_for(text, font, size, width):
        pdf.drawString(x, y, line)
        y -= leading
    return y


def draw_footer(pdf: canvas.Canvas, page_number: int, total_pages: int) -> None:
    pdf.setStrokeColor(LINE)
    pdf.line(MARGIN, 30, PAGE_W - MARGIN, 30)
    pdf.setFont("Helvetica", 7.5)
    pdf.setFillColor(MUTED)
    pdf.drawString(MARGIN, 18, "Developers Institute | Full Stack readiness")
    pdf.drawRightString(PAGE_W - MARGIN, 18, f"{page_number} / {total_pages}")


def draw_header(pdf: canvas.Canvas, topic: dict) -> float:
    pdf.setFillColor(white)
    pdf.rect(0, PAGE_H - 76, PAGE_W, 76, fill=1, stroke=0)
    if LOGO_PATH.exists():
        pdf.drawImage(ImageReader(LOGO_PATH), MARGIN, PAGE_H - 57, width=182, height=30, preserveAspectRatio=True, mask="auto")
    pdf.setFillColor(RED)
    pdf.rect(0, PAGE_H - 82, PAGE_W, 6, fill=1, stroke=0)
    pdf.setFillColor(INK)
    pdf.setFont("Helvetica-Bold", 9)
    pdf.drawRightString(PAGE_W - MARGIN, PAGE_H - 46, f"TOPIC {topic['number']:02d}")
    return PAGE_H - 112


def draw_section_title(pdf: canvas.Canvas, label: str, x: float, y: float) -> float:
    pdf.setFillColor(RED)
    pdf.setFont("Helvetica-Bold", 8)
    pdf.drawString(x, y, clean(label).upper())
    return y - 14


def draw_bullets(pdf: canvas.Canvas, entries: list[str], x: float, y: float, width: float, color=INK) -> float:
    for entry in entries:
        pdf.setFillColor(RED if color == INK else color)
        pdf.circle(x + 2.5, y + 2.5, 2.5, fill=1, stroke=0)
        y = draw_lines(pdf, entry, x + 12, y + 6, width - 12, size=8.4, leading=11.5, color=color) - 3
    return y


def draw_cover(pdf: canvas.Canvas, data: dict, total_pages: int) -> None:
    pdf.setFillColor(PAPER)
    pdf.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    pdf.setFillColor(white)
    pdf.rect(0, PAGE_H - 112, PAGE_W, 112, fill=1, stroke=0)
    if LOGO_PATH.exists():
        pdf.drawImage(ImageReader(LOGO_PATH), MARGIN, PAGE_H - 77, width=216, height=36, preserveAspectRatio=True, mask="auto")
    pdf.setFillColor(RED)
    pdf.rect(0, PAGE_H - 120, PAGE_W, 8, fill=1, stroke=0)

    pdf.setFillColor(RED)
    pdf.setFont("Helvetica-Bold", 10)
    pdf.drawString(MARGIN, PAGE_H - 178, "FULL STACK | BEFORE DATABASES")
    pdf.setFillColor(INK)
    pdf.setFont("Helvetica-Bold", 38)
    pdf.drawString(MARGIN, PAGE_H - 232, "Readiness")
    pdf.drawString(MARGIN, PAGE_H - 274, "checklist")
    pdf.setFont("Helvetica", 15)
    pdf.setFillColor(MUTED)
    pdf.drawString(MARGIN, PAGE_H - 310, "Week 3 Day 1 to Week 6 Day 4")

    pdf.setFillColor(white)
    pdf.roundRect(MARGIN, PAGE_H - 425, PAGE_W - MARGIN * 2, 76, 4, fill=1, stroke=0)
    pdf.setFillColor(INK)
    pdf.setFont("Helvetica-Bold", 24)
    pdf.drawString(MARGIN + 22, PAGE_H - 388, f"{data['meta']['topics']} topics")
    pdf.setFont("Helvetica", 9)
    pdf.setFillColor(MUTED)
    pdf.drawString(MARGIN + 22, PAGE_H - 407, f"{data['meta']['days']} official course days | interactive checkboxes | source links")

    y = PAGE_H - 472
    pdf.setFont("Helvetica-Bold", 10)
    pdf.setFillColor(INK)
    pdf.drawString(MARGIN, y, "HOW TO USE")
    y -= 20
    instructions = [
        "Check a skill only when you can explain it without notes.",
        "Run the short example or complete one practice task when unsure.",
        "Open the official source link when a gap needs a full lesson.",
        "Checkbox state is saved by your PDF reader when the file is saved."
    ]
    y = draw_bullets(pdf, instructions, MARGIN, y, PAGE_W - MARGIN * 2)

    y -= 13
    pdf.setFont("Helvetica-Bold", 10)
    pdf.setFillColor(INK)
    pdf.drawString(MARGIN, y, "TOPIC MAP")
    y -= 17
    columns = [data["topics"][::2], data["topics"][1::2]]
    for col_index, column in enumerate(columns):
        x = MARGIN + col_index * (PAGE_W - MARGIN * 2) / 2
        yy = y
        for topic in column:
            pdf.setFillColor(RED)
            pdf.setFont("Helvetica-Bold", 8)
            pdf.drawString(x, yy, f"{topic['number']:02d}")
            pdf.setFillColor(INK)
            pdf.setFont("Helvetica", 7.2)
            pdf.drawString(x + 20, yy, clean(topic["title"]))
            yy -= 17

    draw_footer(pdf, 1, total_pages)
    pdf.showPage()


def draw_topic(pdf: canvas.Canvas, topic: dict, page_number: int, total_pages: int) -> None:
    y = draw_header(pdf, topic)
    pdf.setFillColor(RED)
    pdf.setFont("Helvetica-Bold", 8)
    pdf.drawString(MARGIN, y, clean(topic["eyebrow"]).upper())
    y -= 31
    pdf.setFillColor(INK)
    pdf.setFont("Helvetica-Bold", 25)
    pdf.drawString(MARGIN, y, clean(topic["title"]))
    y -= 22
    y = draw_lines(pdf, topic["summary"], MARGIN, y, PAGE_W - MARGIN * 2, size=10, leading=14, color=MUTED) - 9

    y = draw_section_title(pdf, "I understand this", MARGIN, y)
    for entry in topic["checklist"]:
        field_name = entry["id"]
        pdf.acroForm.checkbox(
            name=field_name,
            x=MARGIN,
            y=y - 1,
            size=12,
            buttonStyle="check",
            borderWidth=1,
            borderColor=HexColor("#99948F"),
            fillColor=white,
            textColor=GREEN,
            forceBorder=True,
            checked=False,
        )
        line_y = y + 1
        wrapped = lines_for(entry["text"], "Helvetica", 8.6, PAGE_W - MARGIN * 2 - 22)
        pdf.setFont("Helvetica", 8.6)
        pdf.setFillColor(INK)
        for line in wrapped:
            pdf.drawString(MARGIN + 20, line_y, clean(line))
            line_y -= 11
        y -= max(19, len(wrapped) * 11 + 5)

    y -= 2
    left_w = (PAGE_W - MARGIN * 2 - 16) * 0.52
    right_x = MARGIN + left_w + 16
    right_w = PAGE_W - MARGIN - right_x
    start_y = y

    y = draw_section_title(pdf, "Small example", MARGIN, y)
    code_lines = clean(topic["example"]).splitlines()
    code_h = max(48, 16 + len(code_lines) * 13)
    pdf.setFillColor(CODE_BG)
    pdf.roundRect(MARGIN, y - code_h + 8, left_w, code_h, 3, fill=1, stroke=0)
    pdf.setFillColor(white)
    pdf.setFont("Courier", 7.7)
    code_y = y - 8
    for line in code_lines:
        pdf.drawString(MARGIN + 11, code_y, line[:74])
        code_y -= 13
    y = y - code_h - 5

    y = draw_section_title(pdf, "Practice", MARGIN, y)
    y = draw_bullets(pdf, topic["practice"], MARGIN, y, left_w)

    right_y = draw_section_title(pdf, "Common mistakes", right_x, start_y)
    right_y = draw_bullets(pdf, topic["mistakes"], right_x, right_y, right_w, color=RED_DARK)
    right_y -= 10
    right_y = draw_section_title(pdf, "Official sources", right_x, right_y)
    for day in topic["sources"]:
        label = clean(f"W{day['week']} D{day['day']} | {day['title']}")
        link_lines = lines_for(label, "Helvetica-Bold", 8, right_w)
        link_top = right_y
        pdf.setFillColor(RED_DARK)
        pdf.setFont("Helvetica-Bold", 8)
        for line in link_lines:
            pdf.drawString(right_x, right_y, line)
            right_y -= 11
        pdf.linkURL(day["url"], (right_x, right_y + 7, right_x + right_w, link_top + 5), relative=0)
        right_y -= 7

    pdf.setFont("Helvetica", 7.5)
    pdf.setFillColor(MUTED)
    pdf.drawString(MARGIN, 44, "Digital checklist: save the PDF to keep checked fields.")
    draw_footer(pdf, page_number, total_pages)
    pdf.showPage()


def build() -> None:
    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    total_pages = len(data["topics"]) + 1
    pdf = canvas.Canvas(str(OUTPUT_PATH), pagesize=A4, pageCompression=1)
    pdf.setTitle("Full Stack Readiness Checklist - Week 3 Day 1 to Week 6 Day 4")
    pdf.setAuthor("Developers Institute")
    pdf.setSubject("Interactive student checklist before databases")
    draw_cover(pdf, data, total_pages)
    for index, topic in enumerate(data["topics"], start=2):
        draw_topic(pdf, topic, index, total_pages)
    pdf.save()
    print(OUTPUT_PATH)


if __name__ == "__main__":
    build()
