import os

DEMOS_DIR = os.path.expanduser('~/Documents/forgio/demos')

# Shared CSS for the RFQ card - added once per file
RFQ_CSS = """
  /* Sample RFQ card */
  .rfq-sample{padding:56px 0;background:#f9f8f5;border-top:1px solid #e8e4da;border-bottom:1px solid #e8e4da}
  .rfq-sample .c{max-width:1140px;margin:0 auto;padding-left:clamp(1.25rem,4vw,2.5rem);padding-right:clamp(1.25rem,4vw,2.5rem)}
  .rfq-sample-eyebrow{font-size:11px;letter-spacing:.16em;text-transform:uppercase;font-weight:600;margin-bottom:10px;opacity:.7}
  .rfq-sample-title{font-family:'DM Serif Display',serif;font-size:clamp(1.4rem,2.5vw,2rem);line-height:1.15;margin-bottom:8px}
  .rfq-sample-sub{font-size:14px;opacity:.65;margin-bottom:32px;max-width:56ch}
  .rfq-card{background:#0f1117;border-radius:8px;overflow:hidden;max-width:780px}
  .rfq-card-header{padding:18px 22px;border-bottom:1px solid rgba(255,255,255,.08)}
  .rfq-card-label{font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#FF6B35;margin-bottom:8px;font-family:monospace}
  .rfq-card-headline{font-size:16px;font-weight:600;color:#F5F1EB;line-height:1.3;margin-bottom:8px}
  .rfq-card-badges{display:flex;gap:10px;align-items:center}
  .rfq-badge-score{background:rgba(34,197,94,.15);color:#34D399;padding:2px 10px;border-radius:999px;font-size:11px;font-weight:700;font-family:monospace}
  .rfq-badge-priority{font-size:11px;color:rgba(255,255,255,.4);font-family:monospace}
  .rfq-card-body{padding:16px 22px}
  .rfq-row{display:flex;gap:12px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.05);font-size:12px}
  .rfq-row:last-child{border-bottom:none}
  .rfq-key{color:#FF6B35;font-weight:600;text-transform:uppercase;letter-spacing:.06em;font-size:10px;min-width:90px;padding-top:1px;font-family:monospace}
  .rfq-val{color:#C5C0B8;flex:1;line-height:1.5}
  .rfq-missing{margin:12px 22px;padding:10px 14px;background:rgba(245,158,11,.08);border:1px solid rgba(245,158,11,.2);border-radius:6px}
  .rfq-missing-label{font-size:10px;font-weight:600;color:#F59E0B;text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px;font-family:monospace}
  .rfq-missing-text{font-size:11px;color:#D97706;line-height:1.6}
  .rfq-card-footer{padding:10px 22px;border-top:1px solid rgba(255,255,255,.05);font-size:10px;color:rgba(255,255,255,.25);font-family:monospace}
"""

# RFQ card HTML per demo
RFQ_CARDS = {
    'conveyors.html': {
        'eyebrow': 'What your estimators receive',
        'title': 'A scoped brief, ready to price.',
        'sub': 'Every completed conversation delivers a structured RFQ to your inbox — not a vague email.',
        'accent': '#E8A838',
        'headline': 'Food-grade belt conveyor, 14m × 600mm, IP66 washdown, biscuit packing line',
        'score': '84',
        'priority': 'HIGH PRIORITY',
        'rows': [
            ('Type', 'New installation — belt conveyor'),
            ('Dimensions', '14m length × 600mm belt width × 900mm centres'),
            ('Product', 'Biscuit / dry goods — food contact, crumb management required'),
            ('Environment', 'IP66 washdown, food-grade stainless steel, EU 1935/2004 compliance'),
            ('Drive', 'Variable speed, 0.5–1.2 m/s, single drive head'),
            ('Integration', 'Existing packing line — infeed from depositor, outfeed to wrapper'),
            ('Throughput', '80 packs/min target'),
            ('Site', 'Harrogate, North Yorkshire — existing production facility'),
            ('Timeline', 'Required by April — new product line launch'),
            ('Contact', 'Dave Thompson, Engineering Manager, Acme Foods Ltd'),
        ],
        'missing': 'Floor loading capacity · Existing electrical supply voltage · Preferred conveyor manufacturer'
    },
    'fabrication.html': {
        'eyebrow': 'What your estimators receive',
        'title': 'A scoped brief, ready to price.',
        'sub': 'Every completed conversation delivers a structured RFQ to your inbox — not a vague email.',
        'accent': '#e8b04a',
        'headline': 'Stainless 316 handrail system, 47m run, external balcony, commercial office build',
        'score': '79',
        'priority': 'HIGH PRIORITY',
        'rows': [
            ('Type', 'Architectural metalwork — balustrade and handrail system'),
            ('Material', 'Stainless steel 316L — marine-grade, external environment'),
            ('Specification', '47m total run · 1100mm post height · 42.4mm top rail'),
            ('Finish', 'Satin brushed 240 grit — consistent with existing spec'),
            ('Standard', 'BS EN 1090 EXC2 · CE/UKCA marked · BS 6180 compliant'),
            ('Fixings', 'Core-drilled into concrete balcony edge — structural drawings attached'),
            ('Drawings', 'Architect DWGs supplied — DXF and PDF'),
            ('Quantity', '47 linear metres, 12 posts, 4 returns, 2 gate openings'),
            ('Site', 'Manchester city centre — city centre delivery constraints apply'),
            ('Timeline', 'Required on site 3 March — following programme'),
            ('Contact', 'Sarah Jennings, QS, Broadgate Construction'),
        ],
        'missing': 'Confirmation of post fixing centres · Gate hardware spec · RAL colour for any powder-coated elements'
    },
    'refrigeration.html': {
        'eyebrow': 'What your estimators receive',
        'title': 'A scoped brief, ready to price.',
        'sub': 'Every completed conversation delivers a structured RFQ to your inbox — not a vague email.',
        'accent': '#56C8D8',
        'headline': 'Walk-in frozen store, 120m², -21°C, BRC Grade A, seafood distribution, Grimsby',
        'score': '91',
        'priority': 'HIGH PRIORITY',
        'rows': [
            ('Type', 'New installation — walk-in frozen cold store'),
            ('Spec', '120m² floor area · -21°C operating temperature · 4.5m clear internal height'),
            ('Use', 'Frozen fish and seafood — BRC Grade A food safety standard'),
            ('Compliance', 'F-Gas regulation compliant · REFCOM registered contractor required · BRC Grade A'),
            ('Monitoring', 'Continuous temperature monitoring and data logging required · HACCP compliant'),
            ('Site', 'Grimsby, Lincolnshire — existing warehouse facility, 3-phase supply available'),
            ('Timeline', 'Operational by September — tied to new distribution contract start'),
            ('Drawings', 'Warehouse floor plan attached — 1:100 PDF'),
            ('Contact', 'Mark Taylor, Operations Manager, Westfield Distribution Ltd'),
        ],
        'missing': 'Electrical supply capacity (kVA available) · Floor drainage arrangement · Preferred refrigerant (R448A / R449A)'
    },
    'services.html': {
        'eyebrow': 'What your estimators receive',
        'title': 'A scoped brief, ready to price.',
        'sub': 'Every completed conversation delivers a structured RFQ to your inbox — not a vague email.',
        'accent': '#34C8A0',
        'headline': 'Planned maintenance contract — warehouse conveyor & MHE, 6 units, Sheffield',
        'score': '76',
        'priority': 'MEDIUM PRIORITY',
        'rows': [
            ('Type', 'PPM contract — conveyor and materials handling equipment'),
            ('Equipment', '4× belt conveyors · 1× pallet wrapper · 1× stretch hooder — mixed manufacturers'),
            ('Site', 'Sheffield distribution centre — single site, 24/7 operation'),
            ('Coverage', 'Planned maintenance visits required: quarterly minimum'),
            ('Response', '4-hour emergency response SLA required — production critical'),
            ('Compliance', 'LOLER and PUWER statutory inspections to be included'),
            ('Current provider', 'Switching from existing provider — contract expires end of quarter'),
            ('Timeline', 'Contract start required 1 July — 12-month initial term'),
            ('Contact', 'Phil Marsh, Facilities Manager, Northern Logistics Group'),
        ],
        'missing': 'Full equipment list with serial numbers · Current maintenance records · Preferred visit schedule (days/times)'
    },
    'electrical.html': {
        'eyebrow': 'What your estimators receive',
        'title': 'A scoped brief, ready to price.',
        'sub': 'Every completed conversation delivers a structured RFQ to your inbox — not a vague email.',
        'accent': '#f5c518',
        'headline': 'ATEX Zone 2 MCC panel build, 400V 3-phase, Siemens S7-1500, chemical plant, Teesside',
        'score': '88',
        'priority': 'HIGH PRIORITY',
        'rows': [
            ('Type', 'Control panel build — MCC with ATEX Zone 2 certification'),
            ('Supply', '400V 3-phase TN-S · 200A incoming · 3× 63A outgoing circuits'),
            ('Hazardous area', 'ATEX Zone 2 gas (IIA, T3) — Ex e / Ex d equipment required · IECEx certification'),
            ('Control system', 'Siemens S7-1500 PLC · Profinet I/O · Existing SCADA integration (WinCC)'),
            ('Enclosure', 'GRP · IP66 · Floor-standing · Climate control unit required'),
            ('Standards', 'BS EN 61439 · IEC 60079 · CE marked · Third-party witness test required'),
            ('Site', 'Teesside chemical plant — permit-to-work system · ATEX site survey completed'),
            ('Shutdown', '72-hour planned shutdown window available — April'),
            ('Drawings', 'Schematic pack attached — AutoCAD DWG format'),
            ('Contact', 'Graham Lowther, Project Engineer, Ineos Grangemouth'),
        ],
        'missing': 'DNO confirmation of supply capacity · Full I/O schedule · Preferred cable entry arrangement (top/bottom)'
    },
}

def build_rfq_section(demo_key):
    d = RFQ_CARDS[demo_key]
    rows_html = '\n'.join(
        f'          <div class="rfq-row"><span class="rfq-key">{k}</span><span class="rfq-val">{v}</span></div>'
        for k, v in d['rows']
    )
    return f"""
<section class="rfq-sample">
  <div class="c">
    <div class="rfq-sample-eyebrow" style="color:{d['accent']}">{d['eyebrow']}</div>
    <h2 class="rfq-sample-title">{d['title']}</h2>
    <p class="rfq-sample-sub">{d['sub']}</p>
    <div class="rfq-card">
      <div class="rfq-card-header">
        <div class="rfq-card-label">Forgio-qualified RFQ · delivered instantly</div>
        <div class="rfq-card-headline">{d['headline']}</div>
        <div class="rfq-card-badges">
          <span class="rfq-badge-score">Score: {d['score']}/100</span>
          <span class="rfq-badge-priority">· {d['priority']}</span>
        </div>
      </div>
      <div class="rfq-card-body">
{rows_html}
      </div>
      <div class="rfq-missing">
        <div class="rfq-missing-label">Follow up on</div>
        <div class="rfq-missing-text">{d['missing']}</div>
      </div>
      <div class="rfq-card-footer">Generated by Forgio · Leicestershire, England · {demo_key.replace('.html','')}_v1</div>
    </div>
  </div>
</section>
"""

# Insert points per demo file
INSERT_BEFORE = {
    'conveyors.html':     '<section class="features">',
    'fabrication.html':   '<section class="std"><div class="c">',
    'refrigeration.html': '<section class="features">',
    'services.html':      '<section class="std"><div class="c">',
    'electrical.html':    '<section class="std" id="services">',
}

# CSS insert point (before </style>)
for fname, insert_before in INSERT_BEFORE.items():
    fpath = os.path.join(DEMOS_DIR, fname)
    if not os.path.exists(fpath):
        print(f'✗ Not found: {fname}')
        continue

    with open(fpath, 'r') as f:
        c = f.read()

    # Add CSS
    if 'rfq-sample' not in c:
        c = c.replace('</style>', RFQ_CSS + '\n</style>', 1)
        print(f'✓ CSS added to {fname}')
    else:
        print(f'• CSS already in {fname}')

    # Add HTML section
    if 'rfq-sample' in c and 'rfq-card-headline' in c:
        print(f'• RFQ section already in {fname}')
    else:
        rfq_html = build_rfq_section(fname)
        if insert_before in c:
            c = c.replace(insert_before, rfq_html + '\n' + insert_before, 1)
            print(f'✓ RFQ section added to {fname}')
        else:
            print(f'✗ Insert point not found in {fname}: "{insert_before}"')

    with open(fpath, 'w') as f:
        f.write(c)

print('\n✅ Done')
