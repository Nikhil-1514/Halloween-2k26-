import { useState, useRef } from 'react';
import { CASES, CHARACTERS } from '../levels/levelData';
import './Certificate.css';

/**
 * CERTIFICATE — client-side PDF generation via jsPDF
 * Elegant Halloween Survivor Certificate
 */
const Certificate = ({ player, arcade, onDone }) => {
  const [generating, setGen] = useState(false);
  const [error, setError]    = useState('');
  const [done, setDone]      = useState(false);
  const [exiting, setExit]   = useState(false);
  const locked               = useRef(false);

  const playerName = player?.name || 'Survivor';
  const date       = 'October 31, 2026';
  const lives      = arcade?.lives ?? 0;
  const decisions  = player?.level4Decisions ?? [];
  const correctCount = decisions.filter(decision => decision.correct).length;
  const incorrectCount = decisions.length - correctCount;
  const evidenceCount = arcade?.evidence?.length ?? 0;
  const survivalEvents = arcade?.survivalEvents ?? [];
  const survivedEvents = survivalEvents.filter(event => event.survived).length;
  const character = CHARACTERS.find(item => item.id === player?.character)?.label ?? 'Not recorded';
  const fearResponses = {
    A: 'Face it',
    B: 'Run',
    C: 'Freeze',
    D: 'Try to understand it',
    E: "Pretend it isn't there",
  };
  const caseResults = CASES.map(item => {
    const result = arcade?.caseResults?.find(entry => entry.caseId === item.id);
    return { title: item.title, solved: Boolean(result?.solved) };
  });
  const nightmare = player?.nightmare?.trim() || 'Skipped';

  const sanitizeFilename = (name) =>
    name.replace(/[^a-zA-Z0-9_\- ]/g, '').trim().replace(/\s+/g, '_') || 'Survivor';

  const toPdfText = (value) => Array.from(String(value ?? 'Not recorded'), (character) => {
    const code = character.codePointAt(0);
    return code >= 32 && code <= 126 ? character : '?';
  }).join('').trim() || 'Not recorded';

  const generatePDF = async () => {
    if (generating || locked.current) return;
    locked.current = true;
    setGen(true);
    setError('');

    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({
        orientation: 'landscape',
        unit:        'mm',
        format:      'a4',
      });

      const W = doc.internal.pageSize.getWidth();
      const H = doc.internal.pageSize.getHeight();

      // Background
      doc.setFillColor(7, 5, 5);
      doc.rect(0, 0, W, H, 'F');

      // Outer border
      doc.setDrawColor(139, 26, 26);
      doc.setLineWidth(0.8);
      doc.rect(6, 6, W - 12, H - 12);

      // Inner border
      doc.setDrawColor(80, 30, 30);
      doc.setLineWidth(0.3);
      doc.rect(10, 10, W - 20, H - 20);

      // Top ornament line
      doc.setDrawColor(200, 75, 17);
      doc.setLineWidth(0.4);
      doc.line(30, 24, W - 30, 24);
      doc.line(30, 26, W - 30, 26);

      // HALLOWEEN 2026
      doc.setTextColor(139, 26, 26);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      const tag = 'HALLOWEEN 2026';
      doc.text(tag, W / 2, 20, { align: 'center', charSpace: 4 });

      // Title
      doc.setTextColor(232, 210, 190);
      doc.setFontSize(26);
      doc.setFont('helvetica', 'bold');
      doc.text('SURVIVOR CERTIFICATE', W / 2, 42, { align: 'center' });

      // Divider
      doc.setDrawColor(80, 40, 20);
      doc.setLineWidth(0.2);
      doc.line(60, 47, W - 60, 47);

      // "This certifies that"
      doc.setTextColor(140, 120, 100);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('This certifies that', W / 2, 57, { align: 'center' });

      // Player name
      doc.setTextColor(200, 75, 17);
      const nameLines = doc.splitTextToSize(toPdfText(playerName), W - 60).slice(0, 2);
      doc.setFontSize(nameLines.length > 1 ? 18 : 22);
      doc.setFont('helvetica', 'bold');
      doc.text(nameLines, W / 2, 70, { align: 'center' });

      // "successfully completed"
      doc.setTextColor(140, 120, 100);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('successfully completed', W / 2, 84, { align: 'center' });

      // Challenge name
      doc.setTextColor(232, 210, 190);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('THE HALLOWEEN CHALLENGE', W / 2, 96, { align: 'center' });

      // Stats row
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(120, 100, 80);
      const stats = [
        '5 LEVELS',
        `${caseResults.filter(result => result.solved).length} / 3 CASES`,
        `${decisions.length} / 12 DECISIONS`,
      ];
      const spacing = 40;
      const startX = W / 2 - spacing;
      stats.forEach((s, i) => {
        doc.text(s, startX + i * spacing, 107, { align: 'center', charSpace: 2 });
      });

      // Mid divider
      doc.setDrawColor(60, 30, 20);
      doc.setLineWidth(0.2);
      doc.line(60, 112, W - 60, 112);

      // Quote
      doc.setTextColor(100, 80, 60);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      const quote = ['"You entered. You chose. You survived."'];
      doc.text(quote, W / 2, 121, { align: 'center' });

      // Date
      doc.setTextColor(100, 80, 60);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(date, W / 2, 132, { align: 'center' });

      // Signature
      doc.setTextColor(200, 75, 17);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text('NIKHIL KOTIPATRUNI', W / 2, 149, { align: 'center', charSpace: 1 });

      // Signature line
      doc.setDrawColor(80, 40, 20);
      doc.setLineWidth(0.3);
      doc.line(W / 2 - 40, 152, W / 2 + 40, 152);

      // Bottom ornament
      doc.setDrawColor(200, 75, 17);
      doc.setLineWidth(0.4);
      doc.line(30, H - 24, W - 30, H - 24);
      doc.line(30, H - 26, W - 30, H - 26);

      // Corner decorations
      const corners = [[18, 18], [W - 18, 18], [18, H - 18], [W - 18, H - 18]];
      doc.setTextColor(139, 26, 26);
      doc.setFontSize(10);
      corners.forEach(([x, y]) => doc.text('✦', x, y, { align: 'center' }));

      doc.addPage();
      doc.setFillColor(7, 5, 5);
      doc.rect(0, 0, W, H, 'F');
      doc.setDrawColor(139, 26, 26);
      doc.setLineWidth(0.8);
      doc.rect(6, 6, W - 12, H - 12);
      doc.setDrawColor(80, 30, 30);
      doc.setLineWidth(0.3);
      doc.rect(10, 10, W - 20, H - 20);
      doc.setTextColor(232, 210, 190);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('SURVIVOR RECORD', W / 2, 25, { align: 'center' });
      doc.setDrawColor(200, 75, 17);
      doc.line(20, 31, W - 20, 31);

      const drawField = (label, value, x, y, width = 122) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(139, 26, 26);
        doc.text(label.toUpperCase(), x, y);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(232, 210, 190);
        doc.text(doc.splitTextToSize(toPdfText(value), width).slice(0, 2), x, y + 5);
      };

      drawField('Age', player?.age || 'Not recorded', 18, 43);
      drawField('Character / hobby', character, 18, 61);
      drawField('Risk style', player?.riskStyle?.toLowerCase(), 18, 79);
      drawField('Observation style', player?.observationStyle?.toLowerCase(), 18, 97);
      drawField('Fear', player?.fear, 157, 43, 122);
      drawField('Fear response', fearResponses[player?.fearResponse], 157, 61, 122);
      drawField('Investigation score', `${correctCount} / ${decisions.length || 12} correct`, 157, 79, 122);
      drawField('Incorrect decisions', incorrectCount, 157, 97, 122);
      drawField('Evidence score', `${evidenceCount} / 12`, 18, 118, 78);
      drawField('Survival score', `${survivedEvents} / ${survivalEvents.length || 3} events`, 110, 118, 78);
      drawField('Remaining lives', `${lives} / 3`, 202, 118, 75);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(139, 26, 26);
      doc.text('CASE RESULTS', 18, 139);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(232, 210, 190);
      doc.text(caseResults.map(result => `${result.title}: ${result.solved ? 'Complete' : 'Incomplete'}`).join('  |  '), 18, 145, { maxWidth: W - 36 });

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(139, 26, 26);
      doc.text('FINAL NIGHTMARE', 18, 158);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(232, 210, 190);
      const nightmareLines = doc.splitTextToSize(toPdfText(nightmare), W - 36);
      doc.text(nightmareLines.slice(0, 7), 18, 164);
      doc.setTextColor(100, 80, 60);
      doc.setFontSize(8);
      doc.text(`${date}  |  Host: Nikhil Kotipatruni`, W / 2, 193, { align: 'center' });

      const filename = `Halloween_Challenge_Certificate_${sanitizeFilename(playerName)}.pdf`;
      doc.save(filename);
      setDone(true);
    } catch (err) {
      console.error('[Certificate]', err);
      setError('Certificate generation failed. Please try again.');
    } finally {
      setGen(false);
      locked.current = false;
    }
  };

  const handleContinue = () => {
    setExit(true);
    setTimeout(onDone, 800);
  };

  return (
    <div className={`cert-scene ${exiting ? 'exiting' : ''}`}>
      <div className="cert-vignette" aria-hidden="true" />

      {/* Preview */}
      <section className="cert-preview" aria-label="Certificate preview">
        <div className="cert-outer-border">
          <div className="cert-inner">
            <div className="cert-top-line" />
            <p className="cert-year">HALLOWEEN 2026</p>
            <h1 className="cert-main-title">SURVIVOR CERTIFICATE</h1>
            <div className="cert-divider" />
            <p className="cert-certifies">This certifies that</p>
            <p className="cert-name">{playerName}</p>
            <p className="cert-certifies">successfully completed</p>
            <p className="cert-challenge">THE HALLOWEEN CHALLENGE</p>
            <div className="cert-stats">
              <span>5 LEVELS</span>
              <span>{caseResults.filter(result => result.solved).length} / 3 CASES</span>
              <span>{decisions.length} / 12 DECISIONS</span>
            </div>
            <div className="cert-record">
              <span>Age: {player?.age || 'Not recorded'}</span>
              <span>Character / hobby: {character}</span>
              <span>Risk style: {player?.riskStyle?.toLowerCase() || 'Not recorded'}</span>
              <span>Observation style: {player?.observationStyle?.toLowerCase() || 'Not recorded'}</span>
              <span>Fear: {player?.fear || 'Not recorded'}</span>
              <span>Fear response: {fearResponses[player?.fearResponse] || 'Not recorded'}</span>
              <span>Investigation score: {correctCount} / {decisions.length || 12}</span>
              <span>Incorrect decisions: {incorrectCount}</span>
              <span>Evidence score: {evidenceCount} / 12</span>
              <span>Survival score: {survivedEvents} / {survivalEvents.length || 3}</span>
              <span>Remaining lives: {lives} / 3</span>
              {caseResults.map(result => (
                <span key={result.title}>{result.title}: {result.solved ? 'Complete' : 'Incomplete'}</span>
              ))}
              <span className="cert-nightmare">Nightmare: {nightmare}</span>
            </div>
            <div className="cert-quote">"You entered. You chose. You survived."</div>
            <p className="cert-date">{date}</p>
            <p className="cert-sig">NIKHIL KOTIPATRUNI</p>
            <div className="cert-sig-line" />
            <div className="cert-bottom-line" />
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="cert-actions">
        {error && <p className="cert-error" role="alert">{error}</p>}
        <button
          id="cert-download-btn"
          className="btn btn-primary"
          onClick={generatePDF}
          disabled={generating}
        >
          {generating ? 'Generating...' : done ? 'Download Again' : 'Download Certificate (PDF)'}
        </button>
        <button
          id="cert-continue-btn"
          className="btn btn-ghost cert-skip"
          onClick={handleContinue}
          disabled={generating}
        >
          {done ? 'Continue' : 'Skip'}
        </button>
      </div>
    </div>
  );
};

export default Certificate;
