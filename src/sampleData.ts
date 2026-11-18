import { Subject, Flashcard, StudyFile, Folder } from './types';

export const SAMPLE_SUBJECTS: Subject[] = [
  {
    id: 'sub-1',
    name: 'Algorithmen & Datenstrukturen',
    code: 'INF-102',
    color: '#4ade80', // Emerald/green
    description: 'Komplexitätsanalyse, Graphentheorie, Such- & Sortieralgorithmen, Bäume',
    semester: 'Semester 2',
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    iconName: 'Cpu',
  },
  {
    id: 'sub-2',
    name: 'Datenbanksysteme',
    code: 'INF-204',
    color: '#2dd4bf', // Teal
    description: 'Relationales Modell, SQL, Normalisierung, Transaktionsmanagement (ACID)',
    semester: 'Semester 3',
    createdAt: Date.now() - 25 * 24 * 60 * 60 * 1000,
    iconName: 'Database',
  },
  {
    id: 'sub-3',
    name: 'Software Engineering',
    code: 'INF-201',
    color: '#a3e635', // Lime/Sage
    description: 'Architekturmuster, Entwurfsmuster, Agile Methoden, Clean Code & Testing',
    semester: 'Semester 3',
    createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
    iconName: 'Code',
  },
  {
    id: 'sub-4',
    name: 'Mathematik für Informatiker',
    code: 'MAT-101',
    color: '#86efac', // Soft green
    description: 'Lineare Algebra, Diskrete Mathematik, Wahrscheinlichkeitsrechnung',
    semester: 'Semester 1',
    createdAt: Date.now() - 40 * 24 * 60 * 60 * 1000,
    iconName: 'Sigma',
  }
];

export const SAMPLE_FOLDERS: Folder[] = [
  {
    id: 'f-1',
    subjectId: 'sub-1',
    parentId: null,
    name: 'Vorlesungsfolien',
    createdAt: Date.now() - 25 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'f-2',
    subjectId: 'sub-1',
    parentId: null,
    name: 'Übungsblätter & Lösungen',
    createdAt: Date.now() - 22 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'f-3',
    subjectId: 'sub-1',
    parentId: null,
    name: 'Klausurvorbereitung',
    createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'f-4',
    subjectId: 'sub-2',
    parentId: null,
    name: 'SQL Skripte & Notizen',
    createdAt: Date.now() - 18 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'f-5',
    subjectId: 'sub-2',
    parentId: null,
    name: 'Zusammenfassungen',
    createdAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
  },
];

export const SAMPLE_FLASHCARDS: Flashcard[] = [
  {
    id: 'card-1',
    subjectId: 'sub-1',
    category: 'Graphen',
    question: 'Was ist der Unterschied zwischen Tiefensuche (DFS) und Breitensuche (BFS)?',
    answer: 'BFS (Breitensuche) verwendet eine Queue (FIFO) und besucht Knoten ebenenweise (optimal für kürzeste Pfade in ungewichteten Graphen).\n\nDFS (Tiefensuche) verwendet einen Stack / Rekursion (LIFO) und durchläuft Pfade maximal in die Tiefe, bevor es zurücksetzt (Backtracking).',
    hint: 'Denke an FIFO vs. LIFO Datenstrukturen.',
    repetitions: 3,
    intervalDays: 4,
    easeFactor: 2.5,
    nextReviewDate: Date.now() - 10000, // Due today
    lastReviewedDate: Date.now() - 4 * 24 * 60 * 60 * 1000,
    createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'card-2',
    subjectId: 'sub-1',
    category: 'Komplexität',
    question: 'Welche Zeitkomplexität hat QuickSort im Worst-Case und im Average-Case?',
    answer: 'Average Case: O(n log n)\nWorst Case: O(n²)\n\nDer Worst Case tritt auf, wenn stets das kleinste oder größte Element als Pivot gewählt wird (z.B. bei bereits sortierter Folge mit ungünstiger Pivot-Wahl).',
    hint: 'Günstige vs. ungünstige Pivot-Auswahl.',
    repetitions: 2,
    intervalDays: 2,
    easeFactor: 2.4,
    nextReviewDate: Date.now() - 5000, // Due today
    lastReviewedDate: Date.now() - 2 * 24 * 60 * 60 * 1000,
    createdAt: Date.now() - 8 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'card-3',
    subjectId: 'sub-1',
    category: 'Bäume',
    question: 'Was definiert einen AVL-Baum und welche Invariante muss gelten?',
    answer: 'Ein AVL-Baum ist ein selbstbalancierender binärer Suchbaum. Für jeden Knoten darf sich die Höhe des linken und rechten Teilbaums maximal um 1 unterscheiden (Balance-Faktor ∈ {-1, 0, 1}). Bei Verletzung erfolgt Rebalancierung durch Rotationen.',
    hint: 'Balance-Faktor und Höhenunterschied.',
    repetitions: 1,
    intervalDays: 1,
    easeFactor: 2.3,
    nextReviewDate: Date.now() + 2 * 24 * 60 * 60 * 1000, // Future
    lastReviewedDate: Date.now() - 12 * 60 * 60 * 1000,
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'card-4',
    subjectId: 'sub-2',
    category: 'Transaktionen',
    question: 'Wofür steht das ACID-Prinzip bei relationalen Datenbanksystemen?',
    answer: 'A - Atomicity (Atomarität: ganz oder gar nicht)\nC - Consistency (Konsistenz: Erhalt von Integritätsbedingungen)\nI - Isolation (Isolation: Nebenläufige Transaktionen beeinflussen sich nicht)\nD - Durability (Dauerhaftigkeit: Beständigkeit nach Commit trotz Absturz)',
    hint: 'Vier fundamentale Eigenschaften von Datenbanktransaktionen.',
    repetitions: 4,
    intervalDays: 6,
    easeFactor: 2.6,
    nextReviewDate: Date.now() - 3000, // Due today
    lastReviewedDate: Date.now() - 5 * 24 * 60 * 60 * 1000,
    createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'card-5',
    subjectId: 'sub-2',
    category: 'Normalisierung',
    question: 'Wann befindet sich eine Relation in der 3. Normalform (3NF)?',
    answer: 'Eine Relation ist in 3NF, wenn sie in 2NF ist und kein Nicht-Schlüsselattribut transitiv von einem Schlüsselkandidaten abhängt (Jedes Nichtschlüssel-Attribut hängt direkt vom Primärschlüssel ab).',
    hint: 'Keine transitiven Abhängigkeiten.',
    repetitions: 0,
    intervalDays: 0,
    easeFactor: 2.5,
    nextReviewDate: Date.now() - 1000, // Due today
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'card-6',
    subjectId: 'sub-3',
    category: 'Design Patterns',
    question: 'Was ist das Singleton-Pattern und welches Problem kann es verursachen?',
    answer: 'Das Singleton stellt sicher, dass eine Klasse nur eine einzige Instanz besitzt und bietet einen globalen Zugriffspunkt darauf.\n\nProblem/Kritik: Erschwert Unit-Testing (versteckte Kopplung, globaler Zustand) und verletzt oft das Single Responsibility Principle.',
    hint: 'Erzeugungsmuster mit genau einer Instanz.',
    repetitions: 3,
    intervalDays: 5,
    easeFactor: 2.5,
    nextReviewDate: Date.now() - 2000, // Due today
    lastReviewedDate: Date.now() - 4 * 24 * 60 * 60 * 1000,
    createdAt: Date.now() - 12 * 24 * 60 * 60 * 1000,
  }
];

export const SAMPLE_FILES: StudyFile[] = [
  {
    id: 'file-1',
    subjectId: 'sub-1',
    folderId: 'f-1',
    name: 'Vorlesung_03_Graphen_und_BFS.pdf',
    size: 2450000,
    type: 'application/pdf',
    extension: 'pdf',
    lastAccessed: Date.now() - 2 * 60 * 60 * 1000,
    createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    tags: ['Vorlesung', 'Graphen', 'Algorithmen'],
  },
  {
    id: 'file-2',
    subjectId: 'sub-1',
    folderId: 'f-2',
    name: 'Uebung_04_Sortierverfahren.pdf',
    size: 890000,
    type: 'application/pdf',
    extension: 'pdf',
    lastAccessed: Date.now() - 5 * 60 * 60 * 1000,
    createdAt: Date.now() - 8 * 24 * 60 * 60 * 1000,
    tags: ['Übung', 'QuickSort', 'MergeSort'],
  },
  {
    id: 'file-3',
    subjectId: 'sub-2',
    folderId: 'f-4',
    name: 'SQL_Cheatsheet_Joins_Indexes.txt',
    size: 45000,
    type: 'text/plain',
    extension: 'txt',
    dataUrl: 'data:text/plain;charset=utf-8,' + encodeURIComponent(`-- FAXAUDIER SQL CHEATSHEET
-- 1. INNER JOIN vs LEFT JOIN
SELECT u.name, o.order_date 
FROM users u 
INNER JOIN orders o ON u.id = o.user_id;

-- 2. Transaktionskontrolle (ACID)
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;

-- 3. B-Tree Indexierung
CREATE INDEX idx_user_email ON users(email);
`),
    lastAccessed: Date.now() - 20 * 60 * 1000,
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    tags: ['Cheatsheet', 'SQL'],
  },
  {
    id: 'file-4',
    subjectId: 'sub-3',
    folderId: null,
    name: 'Architekturmuster_Microservices_Clean_Arch.docx',
    size: 1540000,
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    extension: 'docx',
    lastAccessed: Date.now() - 24 * 60 * 60 * 1000,
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    tags: ['Architektur', 'Summary'],
  }
];
