"use client";

import "./purchases-builder.css";

import { useEffect, useMemo, useState } from "react";

type Order = {
  id: string;
  customer: string;
  phone: string;
  date: string;
  delivery: string;
  status:
    | "Novo"
    | "Aguardando confirmação"
    | "Arte pendente"
    | "Em produção"
    | "Pronto";
  payment: "Pago" | "Parcial" | "Pendente";
  documentType?: "Orçamento" | "Pedido" | "Ordem de serviço";
  amountPaid?: number;
  quoteDueDate?: string;
  paymentDetails?: string;
  paymentVerification?:
    | "Sem comprovante"
    | "Aguardando verificação"
    | "Pagamento confirmado"
    | "Pagamento rejeitado";
  paymentProof?: { name: string; dataUrl: string; uploadedAt: string };
  entryPercent?: number;
  paymentExpected?: number;
  paymentConfirmedAt?: string;
  paymentConfirmedBy?: string;
  financePosted?: boolean;
  rejectionReason?: string;
  paymentAudit?: {
    action: string;
    date: string;
    user: string;
    note?: string;
  }[];
  payments?: { id: number; amount: number; note: string; date: string }[];
  customerData?: { email: string; city: string; notes: string };
  productionStatus?: ProductionStatus;
  productionHistory?: ProductionHistory[];
  priority?: "Normal" | "Alta" | "Urgente";
  productionOwner?: string;
  items: {
    name: string;
    variation: string;
    quantity: number;
    unitPrice: number;
  }[];
};

type ProductionStatus =
  | "Pedido recebido"
  | "Aguardando confirmação"
  | "Aguardando pagamento"
  | "Pagamento em verificação"
  | "Pagamento confirmado"
  | "Aguardando informações do cliente"
  | "Aguardando envio da arte"
  | "Arte em criação"
  | "Arte enviada para aprovação"
  | "Aguardando aprovação da arte"
  | "Arte aprovada"
  | "Em preparação"
  | "Em impressão"
  | "Em corte"
  | "Em sublimação"
  | "Em prensagem"
  | "Em montagem"
  | "Em acabamento"
  | "Em conferência"
  | "Em embalagem"
  | "Pronto para retirada"
  | "Pronto para entrega"
  | "Saiu para entrega"
  | "Entregue"
  | "Produção pausada"
  | "Cancelado";
type ProductionHistory = {
  status: ProductionStatus;
  previous: string;
  date: string;
  user: string;
  note: string;
  notified: boolean;
  channel: string;
};
const productionStatuses: ProductionStatus[] = [
  "Pedido recebido",
  "Aguardando confirmação",
  "Aguardando pagamento",
  "Pagamento em verificação",
  "Pagamento confirmado",
  "Aguardando informações do cliente",
  "Aguardando envio da arte",
  "Arte em criação",
  "Arte enviada para aprovação",
  "Aguardando aprovação da arte",
  "Arte aprovada",
  "Em preparação",
  "Em impressão",
  "Em corte",
  "Em sublimação",
  "Em prensagem",
  "Em montagem",
  "Em acabamento",
  "Em conferência",
  "Em embalagem",
  "Pronto para retirada",
  "Pronto para entrega",
  "Saiu para entrega",
  "Entregue",
  "Produção pausada",
  "Cancelado",
];

const initialOrders: Order[] = [
  {
    id: "PED-1048",
    customer: "Mariana Souza",
    phone: "(62) 99200-4609",
    date: "18/07/2026",
    delivery: "22/07/2026",
    status: "Em produção",
    payment: "Parcial",
    items: [
      {
        name: "Caneca Cerâmica",
        variation: "Branca • 325 ml",
        quantity: 24,
        unitPrice: 27.9,
      },
      {
        name: "Ecobag Estampada",
        variation: "Cru • 35×40 cm",
        quantity: 10,
        unitPrice: 34.9,
      },
    ],
  },
  {
    id: "PED-1047",
    customer: "Lucas Almeida",
    phone: "(62) 98412-3001",
    date: "17/07/2026",
    delivery: "19/07/2026",
    status: "Pronto",
    payment: "Pago",
    items: [
      {
        name: "Camiseta DTF",
        variation: "Preta • M",
        quantity: 12,
        unitPrice: 42.5,
      },
    ],
  },
  {
    id: "PED-1046",
    customer: "Ana Clara Eventos",
    phone: "(62) 98111-7740",
    date: "16/07/2026",
    delivery: "24/07/2026",
    status: "Arte pendente",
    payment: "Pendente",
    items: [
      {
        name: "Squeeze Personalizada",
        variation: "Azul • 500 ml",
        quantity: 30,
        unitPrice: 34.9,
      },
    ],
  },
];

type Product = {
  id: number;
  name: string;
  code: string;
  category: string;
  stock: number;
  minStock: number;
  retailPrice: number;
  wholesalePrice: number;
  wholesaleMin: number;
  variations: string[];
  art: string;
  gradient: string;
  emoji: string;
  images: string[];
};

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Caneca Cerâmica",
    code: "CAN-001",
    category: "Canecas",
    stock: 32,
    minStock: 12,
    retailPrice: 39.9,
    wholesalePrice: 27.9,
    wholesaleMin: 12,
    variations: ["Branca • 325 ml", "Preta • 325 ml", "Mágica • 325 ml"],
    art: "Arte aprovada",
    gradient: "coral",
    emoji: "☕",
  },
  {
    id: 2,
    name: "Camiseta DTF",
    code: "CAM-DTF-002",
    category: "Camisetas",
    stock: 18,
    minStock: 15,
    retailPrice: 59.9,
    wholesalePrice: 42.5,
    wholesaleMin: 10,
    variations: ["Preta • P", "Preta • M", "Salmão • G", "Branca • GG"],
    art: "Revisão pendente",
    gradient: "purple",
    emoji: "👕",
  },
  {
    id: 3,
    name: "Etiqueta Adesiva",
    code: "ETQ-003",
    category: "Adesivos",
    stock: 7,
    minStock: 15,
    retailPrice: 24.9,
    wholesalePrice: 16.9,
    wholesaleMin: 20,
    variations: ["Redonda • 3 cm", "Lacre • 5×6 cm", "Envelope • 4×6 cm"],
    art: "Arte aprovada",
    gradient: "teal",
    emoji: "🏷️",
  },
  {
    id: 4,
    name: "Squeeze Personalizada",
    code: "SQZ-004",
    category: "Garrafas",
    stock: 26,
    minStock: 10,
    retailPrice: 44.9,
    wholesalePrice: 34.9,
    wholesaleMin: 10,
    variations: ["Branca • 500 ml", "Azul • 500 ml"],
    art: "Sem arte",
    gradient: "orange",
    emoji: "🧴",
  },
  {
    id: 5,
    name: "Ecobag Estampada",
    code: "ECO-005",
    category: "Bolsas",
    stock: 11,
    minStock: 12,
    retailPrice: 34.9,
    wholesalePrice: 25.9,
    wholesaleMin: 15,
    variations: ["Cru • 35×40 cm", "Preta • 35×40 cm"],
    art: "Arte aprovada",
    gradient: "blue",
    emoji: "🛍️",
  },
  {
    id: 6,
    name: "Almofada Personalizada",
    code: "ALM-006",
    category: "Casa",
    stock: 21,
    minStock: 8,
    retailPrice: 49.9,
    wholesalePrice: 37.9,
    wholesaleMin: 8,
    variations: ["Branca • 30×30 cm", "Branca • 40×40 cm"],
    art: "Em criação",
    gradient: "pink",
    emoji: "🛋️",
  },
].map((product) => ({ ...product, images: [] }));

const nav = [
  "Visão geral",
  "Produtos",
  "Pedidos",
  "Loja Virtual",
  "Produção",
  "Artes",
  "Pessoas",
  "Compras",
  "Financeiro",
  "Configurações",
];
const navIconPaths = [
  "M3 10 12 3l9 7v10H3V10 M9 20v-7h6v7",
  "m12 3 9 5v8l-9 5-9-5V8l9-5 M3 8l9 5 9-5 M12 13v8",
  "M8 5H5v16h14V5h-3 M8 3h8v4H8V3 M8 12h8 M8 16h5",
  "M3 9h18l-2-6H5L3 9 M4 9v12h16V9 M9 21v-7h6v7 M3 9c0 4 4 4 4 0 0 4 5 4 5 0 0 4 5 4 5 0 0 4 4 4 4 0",
  "M4 7h16 M4 12h16 M4 17h16 M8 4v6 M16 9v6 M10 14v6",
  "m15 3 6 6-12 12H3v-6L15 3 M12 6l6 6 M3 21l6-1",
  "M16 21v-2c0-3-2-5-5-5H9c-3 0-5 2-5 5v2 M10 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8 M17 4c4 0 4 7 0 7 M20 21v-3c0-2-1-3-3-4",
  "M3 3h2l3 12h11l2-9H6 M9 20h.01 M18 20h.01",
  "M3 6h18v14H3V6 M3 6V4h15 M16 11h5v5h-5v-5",
  "M4 6h16 M4 12h16 M4 18h16 M8 3v6 M16 9v6 M10 15v6",
];
function MenuIcon({ index }: { index: number }) {
  return <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={navIconPaths[index]} /></svg>;
}
const STORAGE_KEY = "topstampp:gerenciador:v1";
const BACKUP_KEY = "topstampp:gerenciador:backup:v1";
const AUDIT_KEY = "topstampp:gerenciador:audit:v1";
const DATA_SCHEMA_VERSION = 2;

type SavedSystemData = {
  products?: Product[];
  orders?: Order[];
  customers?: unknown[];
  people?: Person[];
  additionalInformation?: Record<string, unknown>;
  arts?: Art[];
  settings?: SystemSettings;
  schemaVersion?: number;
  savedAt?: string;
};
type AuditEntry = {
  id: number;
  date: string;
  action: string;
  module: string;
  details: string;
  user: string;
};
type StoreLinkHistory = {
  id: number;
  customer: string;
  phone: string;
  link: string;
  campaign: string;
  status: "Link criado" | "Link enviado" | "Link aberto" | "Link desativado";
  sentAt: string;
  accesses: number;
  lastAccess: string;
  order: string;
  value: number;
};

type SystemSettings = {
  businessName: string;
  whatsapp: string;
  pixKey: string;
  quoteValidity: number;
  theme: "Claro" | "Escuro" | "Automático";
  orderNotifications: boolean;
  stockNotifications: boolean;
  footer: FooterSettings;
};
type SocialKey =
  | "instagram"
  | "facebook"
  | "pinterest"
  | "tiktok"
  | "youtube"
  | "linkedin"
  | "twitter"
  | "threads"
  | "telegram";
type FooterSettings = {
  logoUrl: string;
  slogan: string;
  description: string;
  years: string;
  phone: string;
  email: string;
  hours: string;
  address: string;
  city: string;
  state: string;
  cep: string;
  mapsUrl: string;
  instagram: string;
  facebook: string;
  pinterest: string;
  tiktok: string;
  youtube: string;
  linkedin: string;
  twitter: string;
  threads: string;
  telegram: string;
  socialsActive: Record<SocialKey, boolean>;
  developerName: string;
  developerUrl: string;
  newsletter: boolean;
  payments: Record<"pix" | "credit" | "debit" | "boleto" | "transfer", boolean>;
};
const defaultFooter: FooterSettings = {
  logoUrl: "",
  slogan: "Transformando ideias em produtos personalizados de alta qualidade.",
  description:
    "Presentes, brindes e produtos personalizados feitos com carinho para tornar cada momento inesquecível.",
  years: "Há 13 anos criando experiências memoráveis",
  phone: "(62) 92000-4609",
  email: "contato@topstampp.com.br",
  hours: "Segunda a sexta, das 8h às 18h",
  address: "",
  city: "Goiânia",
  state: "GO",
  cep: "",
  mapsUrl: "https://maps.google.com/?q=Goiânia,GO",
  instagram: "",
  facebook: "",
  pinterest: "",
  tiktok: "",
  youtube: "",
  linkedin: "",
  twitter: "",
  threads: "",
  telegram: "",
  socialsActive: {
    instagram: true,
    facebook: true,
    pinterest: true,
    tiktok: true,
    youtube: true,
    linkedin: true,
    twitter: true,
    threads: true,
    telegram: true,
  },
  developerName: "TopStamp",
  developerUrl: "",
  newsletter: true,
  payments: {
    pix: true,
    credit: true,
    debit: true,
    boleto: false,
    transfer: true,
  },
};
const defaultSettings: SystemSettings = {
  businessName: "TopStampp Personalizados",
  whatsapp: "(62) 92000-4609",
  pixKey: "",
  quoteValidity: 7,
  theme: "Automático",
  orderNotifications: true,
  stockNotifications: true,
  footer: defaultFooter,
};

type Art = {
  id: number;
  code: string;
  name: string;
  category: string;
  price: number;
  active: boolean;
  emoji: string;
  gradient: string;
  theme?: string;
  style?: string;
  compatibleCategories?: string[];
  customizable?: string[];
  featured?: boolean;
  new?: boolean;
};
const initialArts: Art[] = [
  {
    id: 1,
    code: "ART-FES-001",
    name: "Safari Aquarela",
    category: "Festas infantis",
    price: 39.9,
    active: true,
    emoji: "🦁",
    gradient: "orange",
    theme: "Infantil",
    style: "Aquarela",
    compatibleCategories: ["Canecas", "Camisetas", "Casa"],
    customizable: ["Nome", "Idade", "Data", "Foto opcional"],
    featured: true,
    new: true,
  },
  {
    id: 2,
    code: "ART-CAS-014",
    name: "Flores & Monograma",
    category: "Casamentos",
    price: 49.9,
    active: true,
    emoji: "💐",
    gradient: "pink",
    theme: "Casamento",
    style: "Floral",
    compatibleCategories: ["Canecas", "Casa", "Bolsas"],
    customizable: ["Nomes", "Data", "Mensagem"],
    featured: true,
  },
  {
    id: 3,
    code: "ART-EMP-008",
    name: "Minimal Corporativo",
    category: "Empresas",
    price: 59.9,
    active: true,
    emoji: "✦",
    gradient: "purple",
    theme: "Empresas",
    style: "Minimalista",
    compatibleCategories: [
      "Canecas",
      "Camisetas",
      "Adesivos",
      "Bolsas",
      "Garrafas",
    ],
    customizable: ["Logomarca", "Texto", "Cores"],
  },
  {
    id: 4,
    code: "ART-DAT-021",
    name: "Feliz Aniversário",
    category: "Datas especiais",
    price: 34.9,
    active: true,
    emoji: "🎉",
    gradient: "coral",
    theme: "Aniversário",
    style: "Festivo",
    compatibleCategories: ["Canecas", "Camisetas", "Casa", "Garrafas"],
    customizable: ["Nome", "Idade", "Data"],
    featured: true,
  },
];

type Customer = {
  id: number;
  name: string;
  phone: string;
  email: string;
  city: string;
  notes: string;
  createdAt: string;
  orderCount: number;
};

type PersonKind = "Cliente" | "Fornecedor" | "Funcionário" | "Outro";
type Person = {
  id: number;
  code: string;
  types: PersonKind[];
  name: string;
  fantasyName?: string;
  document?: string;
  phone: string;
  whatsapp?: string;
  email: string;
  city: string;
  company?: string;
  role?: string;
  tags: string[];
  notes: string;
  status: "Ativo" | "Inativo" | "Com pendência";
  createdAt: string;
  orderCount: number;
  attachments?: PersonAttachment[];
};
type PersonAttachment = {
  id: number;
  name: string;
  type: string;
  size: number;
  dataUrl: string;
  uploadedAt: string;
  originalQuality: true;
};

type Purchase = {
  id: string;
  supplier: string;
  items: number;
  total: number;
  status: string;
  linkedOrder: string;
  due: string;
};
const initialPurchases: Purchase[] = [
  {
    id: "COM-2026-018",
    supplier: "Cerâmica Brasil",
    items: 3,
    total: 2840,
    status: "Aguardando cotação",
    linkedOrder: "PED-1048",
    due: "22/07/2026",
  },
  {
    id: "COM-2026-017",
    supplier: "DTF Suprimentos GO",
    items: 2,
    total: 1490,
    status: "Em análise",
    linkedOrder: "PED-1046",
    due: "20/07/2026",
  },
  {
    id: "COM-2026-016",
    supplier: "Embalagens Centro-Oeste",
    items: 5,
    total: 3280,
    status: "Ordem enviada",
    linkedOrder: "—",
    due: "19/07/2026",
  },
];

type PurchaseItem = {
  id: number;
  name: string;
  code: string;
  category: string;
  variation: string;
  description: string;
  quantity: number;
  unit: string;
  estimated: number;
  due: string;
  notes: string;
  supplierIds: number[];
  linkedOrder: string;
  status: string;
};
type SupplierOrder = {
  id: string;
  supplierId: number;
  supplier: string;
  whatsapp: string;
  itemIds: number[];
  status: string;
  version: number;
  sentAt?: string;
};
function PurchasesModule({
  onMenu,
  people,
  setPeople,
}: {
  onMenu: () => void;
  people: Person[];
  setPeople: React.Dispatch<React.SetStateAction<Person[]>>;
}) {
  const [tab, setTab] = useState("Dashboard");
  const [purchases, setPurchases] = useState(initialPurchases);
  const [showNew, setShowNew] = useState(false);
  const [supplierFiles, setSupplierFiles] = useState<Record<string, string[]>>({
    "Cerâmica Brasil": ["proposta-ceramica-julho.pdf"],
    "DTF Suprimentos GO": [],
  });
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([
    {
      id: 1,
      name: "Caneca de porcelana",
      code: "CAN-001",
      category: "Canecas",
      variation: "Branca • 325 ml",
      description: "Caneca para sublimação",
      quantity: 100,
      unit: "un.",
      estimated: 12.9,
      due: "2026-07-25",
      notes: "Qualidade premium",
      supplierIds: [],
      linkedOrder: "PED-1048",
      status: "Aguardando cotação",
    },
  ]);
  const [selectedSupplierIds, setSelectedSupplierIds] = useState<number[]>([]);
  const [supplierOrders, setSupplierOrders] = useState<SupplierOrder[]>([]);
  const [showSupplierForm, setShowSupplierForm] = useState(false);
  const peopleSuppliers = people.filter((person) =>
    person.types.includes("Fornecedor"),
  );
  const registeredSuppliers: Person[] = peopleSuppliers.length
    ? peopleSuppliers
    : [
        { id: 9101, code: "FOR-001", types: ["Fornecedor"], name: "Cerâmica Brasil", fantasyName: "Cerâmica Brasil", document: "12.345.678/0001-90", phone: "(62) 99111-2200", whatsapp: "(62) 99111-2200", email: "vendas@ceramicabrasil.com.br", city: "Goiânia/GO", tags: ["Canecas", "Cerâmica"], notes: "Prazo médio: 5 dias • pagamento em 28 dias", status: "Ativo", createdAt: "01/07/2026", orderCount: 8 },
        { id: 9102, code: "FOR-002", types: ["Fornecedor"], name: "DTF Suprimentos GO", fantasyName: "DTF GO", document: "23.456.789/0001-10", phone: "(62) 99222-3300", whatsapp: "(62) 99222-3300", email: "comercial@dtfgo.com.br", city: "Aparecida de Goiânia/GO", tags: ["Tintas", "Filmes", "Camisetas"], notes: "Prazo médio: 3 dias", status: "Ativo", createdAt: "02/07/2026", orderCount: 5 },
        { id: 9103, code: "FOR-003", types: ["Fornecedor"], name: "Embalagens Centro-Oeste", fantasyName: "Embala Centro", document: "34.567.890/0001-20", phone: "(62) 99333-4400", whatsapp: "(62) 99333-4400", email: "pedidos@embalacentro.com.br", city: "Goiânia/GO", tags: ["Caixas", "Embalagens"], notes: "Frete grátis acima de R$ 1.000", status: "Ativo", createdAt: "03/07/2026", orderCount: 11 },
      ];
  const tabs = [
    "Dashboard",
    "Solicitações",
    "Pedidos de compra",
    "Cotações",
    "Ordens de compra",
    "Recebimentos",
    "Fornecedores",
    "Vinculadas",
    "Relatórios",
  ];
  const addFiles = (supplier: string, list: FileList | null) => {
    if (!list) return;
    setSupplierFiles((v) => ({
      ...v,
      [supplier]: [
        ...(v[supplier] || []),
        ...Array.from(list).map((f) => f.name),
      ],
    }));
  };
  const addPurchaseItem = () =>
    setPurchaseItems((items) => [
      ...items,
      {
        id: Date.now(),
        name: "",
        code: `ITEM-${String(Date.now()).slice(-5)}`,
        category: "Insumos",
        variation: "Padrão",
        description: "",
        quantity: 1,
        unit: "un.",
        estimated: 0,
        due: "",
        notes: "",
        supplierIds: [],
        linkedOrder: "—",
        status: "Rascunho",
      },
    ]);
  const updatePurchaseItem = (id: number, patch: Partial<PurchaseItem>) =>
    setPurchaseItems((items) =>
      items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  const duplicatePurchaseItem = (item: PurchaseItem) =>
    setPurchaseItems((items) => [
      ...items,
      { ...item, id: Date.now(), code: `${item.code}-CÓPIA` },
    ]);
  const toggleSupplier = (id: number) =>
    setSelectedSupplierIds((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
    );
  const toggleItemSupplier = (itemId: number, supplierId: number) =>
    setPurchaseItems((items) =>
      items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              supplierIds: item.supplierIds.includes(supplierId)
                ? item.supplierIds.filter((x) => x !== supplierId)
                : [...item.supplierIds, supplierId],
            }
          : item,
      ),
    );
  const createSupplier = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const form = event.currentTarget.closest("form");
    if (!form) return;
    const data = new FormData(form);
    const document = String(data.get("document") || "");
    const phone = String(data.get("phone") || "");
    if (
      people.some(
        (p) =>
          (document && p.document === document) || (phone && p.phone === phone),
      )
    )
      return window.alert("Este fornecedor já está cadastrado em Pessoas.");
    const id = Date.now();
    const person: Person = {
      id,
      code: `FOR-${String(id).slice(-5)}`,
      types: ["Fornecedor"],
      name: String(data.get("name")),
      fantasyName: String(data.get("fantasyName") || ""),
      document,
      phone,
      whatsapp: String(data.get("whatsapp") || phone),
      email: String(data.get("email") || ""),
      city: String(data.get("city") || ""),
      tags: String(data.get("products") || "")
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
      notes: String(data.get("notes") || ""),
      status: "Ativo",
      createdAt: new Date().toLocaleDateString("pt-BR"),
      orderCount: 0,
    };
    setPeople((current) => [person, ...current]);
    setSelectedSupplierIds((current) => [...current, id]);
    setShowSupplierForm(false);
  };
  const generateOrders = () => {
    if (!selectedSupplierIds.length)
      return window.alert("Adicione pelo menos um fornecedor.");
    const main = `COMP-${String(purchases.length + 125).padStart(6, "0")}`;
    setSupplierOrders((current) => {
      const existing = new Set(current.map((order) => order.supplierId));
      const additions = selectedSupplierIds
        .filter((id) => !existing.has(id))
        .map((id, index) => {
          const supplier = registeredSuppliers.find((p) => p.id === id)!;
          return {
            id: `${main}-${String.fromCharCode(65 + index)}`,
            supplierId: id,
            supplier: supplier.name,
            whatsapp: supplier.whatsapp || supplier.phone,
            itemIds: purchaseItems
              .filter((item) => item.supplierIds.includes(id))
              .map((item) => item.id),
            status: "Aguardando envio",
            version: 1,
          };
        });
      return [...current, ...additions];
    });
  };
  const orderMessage = (order: SupplierOrder) => {
    const lines = purchaseItems
      .filter((i) => order.itemIds.includes(i.id))
      .map((i) => `• ${i.name} – Quantidade: ${i.quantity} ${i.unit}`)
      .join("\n");
    return `Olá, ${order.supplier}!\n\nSegue o Pedido de Compra nº ${order.id}.\n\nProdutos solicitados:\n${lines || "Itens a confirmar"}\n\nFavor confirmar disponibilidade, valor, prazo de entrega, frete e forma de pagamento.`;
  };
  const sendSupplierOrder = (order: SupplierOrder) => {
    const message = orderMessage(order);
    setSupplierOrders((current) =>
      current.map((x) =>
        x.id === order.id
          ? {
              ...x,
              status: "Enviada pelo WhatsApp",
              sentAt: new Date().toLocaleString("pt-BR"),
            }
          : x,
      ),
    );
    window.open(
      `https://wa.me/${order.whatsapp.replace(/\D/g, "").replace(/^((?!55).)/, "55$1")}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };
  const createPurchase = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPurchases((v) => [
      {
        id: `COM-2026-${String(v.length + 19).padStart(3, "0")}`,
        supplier: `${selectedSupplierIds.length} fornecedor(es)`,
        items: purchaseItems.length,
        total: purchaseItems.reduce(
          (sum, i) => sum + i.quantity * i.estimated,
          0,
        ),
        status: "Solicitação criada",
        linkedOrder:
          purchaseItems.find((i) => i.linkedOrder !== "—")?.linkedOrder || "—",
        due: purchaseItems.find((i) => i.due)?.due || "A definir",
      },
      ...v,
    ]);
    generateOrders();
    setShowNew(false);
  };
  return (
    <section className="workspace purchases-page">
      <header className="topbar">
        <button aria-label="Abrir menu" aria-controls="main-navigation" className="mobile-menu" onClick={onMenu}>
          ☰
        </button>
        <div>
          <p>Suprimentos • custos • fornecedores</p>
          <h1>Compras</h1>
          <span>
            Pedidos, cotações, recebimentos e custos vinculados em um só fluxo.
          </span>
        </div>
        <button className="primary" onClick={() => setShowNew(true)}>
          <b>＋</b> Novo Pedido de Compra
        </button>
      </header>
      <div className="purchase-tabs">
        {tabs.map((x) => (
          <button
            key={x}
            className={tab === x ? "active" : ""}
            onClick={() => setTab(x)}
          >
            {x}
          </button>
        ))}
      </div>
      <section className="metrics purchase-metrics">
        <article className="metric violet">
          <div>◫</div>
          <span>
            Aguardando cotação<strong>6</strong>
            <small>3 com prazo próximo</small>
          </span>
        </article>
        <article className="metric amber">
          <div>⌛</div>
          <span>
            Em andamento<strong>8</strong>
            <small>R$ 12.480,00</small>
          </span>
        </article>
        <article className="metric cyan">
          <div>✓</div>
          <span>
            Recebidas no mês<strong>14</strong>
            <small>Estoque atualizado</small>
          </span>
        </article>
        <article className="metric red">
          <div>!</div>
          <span>
            Compras atrasadas<strong>2</strong>
            <small>Exigem acompanhamento</small>
          </span>
        </article>
      </section>
      <section className="purchase-layout">
        <article className="purchase-panel">
          <header>
            <div>
              <small>{tab.toUpperCase()}</small>
              <h2>Pedidos e cotações recentes</h2>
            </div>
            <button onClick={() => setShowNew(true)}>
              ＋ Criar solicitação
            </button>
          </header>
          <div className="purchase-table">
            <div className="purchase-row head">
              <span>Compra / fornecedor</span>
              <span>Vínculo</span>
              <span>Total</span>
              <span>Status</span>
              <span>Prazo</span>
            </div>
            {purchases.map((p) => (
              <div className="purchase-row" key={p.id}>
                <span>
                  <b>{p.id}</b>
                  <small>
                    {p.supplier} • {p.items} item(ns)
                  </small>
                </span>
                <span>{p.linkedOrder}</span>
                <strong>
                  R${" "}
                  {p.total.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </strong>
                <em>{p.status}</em>
                <span>{p.due}</span>
              </div>
            ))}
          </div>
        </article>
        <aside className="purchase-panel quote-panel">
          <header>
            <div>
              <small>COMPARAÇÃO INTELIGENTE</small>
              <h2>Melhor oferta</h2>
            </div>
          </header>
          <div className="recommendation">
            <i>★</i>
            <b>Cerâmica Brasil</b>
            <span>Melhor custo-benefício</span>
            <p>Menor custo total, entrega dentro do prazo e bom histórico.</p>
            <strong>Economia estimada: R$ 318,00</strong>
          </div>
          <h3>Arquivos por fornecedor</h3>
          {Object.entries(supplierFiles).map(([supplier, files]) => (
            <div className="supplier-files" key={supplier}>
              <b>{supplier}</b>
              {files.map((file) => (
                <small key={file}>📎 {file}</small>
              ))}
              <label>
                ＋ Anexar proposta
                <input
                  type="file"
                  multiple
                  onChange={(e) => addFiles(supplier, e.target.files)}
                />
              </label>
            </div>
          ))}
        </aside>
      </section>
      {supplierOrders.length > 0 && (
        <section className="supplier-orders">
          <header>
            <div>
              <small>ORDENS VINCULADAS À COMPRA PRINCIPAL</small>
              <h2>Ordens separadas por fornecedor</h2>
            </div>
            <button
              onClick={() =>
                supplierOrders
                  .filter((o) => o.status !== "Enviada pelo WhatsApp")
                  .forEach((o, index) =>
                    setTimeout(() => sendSupplierOrder(o), index * 500),
                  )
              }
            >
              ◉ Enviar todas as ordens
            </button>
          </header>
          <div>
            {supplierOrders.map((order) => (
              <article key={order.id}>
                <span>
                  <small>NÚMERO DA ORDEM</small>
                  <b>
                    {order.id}
                    {order.version > 1 ? `-V${order.version}` : ""}
                  </b>
                  <em>{order.status}</em>
                </span>
                <h3>{order.supplier}</h3>
                <p>
                  {purchaseItems
                    .filter((i) => order.itemIds.includes(i.id))
                    .map((i) => `${i.quantity} ${i.unit} ${i.name}`)
                    .join(" • ") || "Nenhum produto atribuído"}
                </p>
                <small>
                  WhatsApp: {order.whatsapp || "Não cadastrado"}
                  {order.sentAt ? ` • Enviada em ${order.sentAt}` : ""}
                </small>
                <div>
                  <button onClick={() => sendSupplierOrder(order)}>
                    ◉ WhatsApp
                  </button>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(orderMessage(order))
                    }
                  >
                    ⧉ Copiar mensagem
                  </button>
                  <button onClick={() => window.print()}>▤ Gerar PDF</button>
                  <button
                    onClick={() =>
                      setSupplierOrders((current) =>
                        current.map((x) =>
                          x.id === order.id
                            ? {
                                ...x,
                                version: x.version + 1,
                                status: "Aguardando envio",
                              }
                            : x,
                        ),
                      )
                    }
                  >
                    ✎ Nova versão
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
      <section className="purchase-flow">
        <span>
          1 <b>Solicitação</b>
        </span>
        <i>→</i>
        <span>
          2 <b>Cotação</b>
        </span>
        <i>→</i>
        <span>
          3 <b>Aprovação</b>
        </span>
        <i>→</i>
        <span>
          4 <b>Recebimento</b>
        </span>
        <i>→</i>
        <span>
          5 <b>Estoque + Financeiro</b>
        </span>
      </section>
      {showNew && (
        <div className="modal-backdrop">
          <form
            className="modal purchase-modal purchase-builder"
            onSubmit={createPurchase}
          >
            <button
              type="button"
              className="close"
              onClick={() => setShowNew(false)}
            >
              ×
            </button>
            <small>NOVA COMPRA • NUMERAÇÃO AUTOMÁTICA</small>
            <h2>Pedido com vários produtos e fornecedores</h2>
            <p>
              Distribua cada item entre um ou mais fornecedores. O sistema
              criará ordens individuais sem revelar preços concorrentes.
            </p>
            <section className="builder-section">
              <header>
                <div>
                  <b>Produtos da compra</b>
                  <small>{purchaseItems.length} item(ns) adicionado(s)</small>
                </div>
                <button type="button" onClick={addPurchaseItem}>
                  ＋ Adicionar Produto
                </button>
              </header>
              {purchaseItems.map((item, index) => (
                <article className="purchase-item-card" key={item.id}>
                  <header>
                    <b>Item {index + 1}</b>
                    <div>
                      <button
                        type="button"
                        onClick={() => duplicatePurchaseItem(item)}
                      >
                        Duplicar
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setPurchaseItems((items) =>
                            items.filter((x) => x.id !== item.id),
                          )
                        }
                      >
                        Remover
                      </button>
                    </div>
                  </header>
                  <div className="item-fields">
                    <label>
                      Nome
                      <input
                        required
                        value={item.name}
                        onChange={(e) =>
                          updatePurchaseItem(item.id, { name: e.target.value })
                        }
                      />
                    </label>
                    <label>
                      Código
                      <input
                        value={item.code}
                        onChange={(e) =>
                          updatePurchaseItem(item.id, { code: e.target.value })
                        }
                      />
                    </label>
                    <label>
                      Categoria
                      <input
                        value={item.category}
                        onChange={(e) =>
                          updatePurchaseItem(item.id, {
                            category: e.target.value,
                          })
                        }
                      />
                    </label>
                    <label>
                      Variação
                      <input
                        value={item.variation}
                        onChange={(e) =>
                          updatePurchaseItem(item.id, {
                            variation: e.target.value,
                          })
                        }
                      />
                    </label>
                    <label>
                      Quantidade
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updatePurchaseItem(item.id, {
                            quantity: Number(e.target.value),
                          })
                        }
                      />
                    </label>
                    <label>
                      Unidade
                      <select
                        value={item.unit}
                        onChange={(e) =>
                          updatePurchaseItem(item.id, { unit: e.target.value })
                        }
                      >
                        <option>un.</option>
                        <option>kg</option>
                        <option>litros</option>
                        <option>m</option>
                        <option>caixas</option>
                        <option>folhas</option>
                      </select>
                    </label>
                    <label>
                      Valor estimado
                      <input
                        type="number"
                        step=".01"
                        value={item.estimated}
                        onChange={(e) =>
                          updatePurchaseItem(item.id, {
                            estimated: Number(e.target.value),
                          })
                        }
                      />
                    </label>
                    <label>
                      Data necessária
                      <input
                        type="date"
                        value={item.due}
                        onChange={(e) =>
                          updatePurchaseItem(item.id, { due: e.target.value })
                        }
                      />
                    </label>
                    <label>
                      Pedido do cliente
                      <select
                        value={item.linkedOrder}
                        onChange={(e) =>
                          updatePurchaseItem(item.id, {
                            linkedOrder: e.target.value,
                          })
                        }
                      >
                        <option>—</option>
                        <option>PED-1048</option>
                        <option>PED-1047</option>
                        <option>PED-1046</option>
                      </select>
                    </label>
                    <label>
                      Status
                      <select
                        value={item.status}
                        onChange={(e) =>
                          updatePurchaseItem(item.id, {
                            status: e.target.value,
                          })
                        }
                      >
                        <option>Rascunho</option>
                        <option>Aguardando cotação</option>
                        <option>Aprovado</option>
                      </select>
                    </label>
                    <label className="wide">
                      Descrição e observações
                      <textarea
                        value={`${item.description}${item.notes ? `\n${item.notes}` : ""}`}
                        onChange={(e) =>
                          updatePurchaseItem(item.id, {
                            description: e.target.value,
                            notes: "",
                          })
                        }
                      />
                    </label>
                  </div>
                </article>
              ))}
            </section>
            <section className="builder-section">
              <header>
                <div>
                  <b>Fornecedores da compra</b>
                  <small>Busca exclusiva em Pessoas → Fornecedores</small>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSupplierForm(!showSupplierForm)}
                >
                  ＋ Cadastrar Novo Fornecedor
                </button>
              </header>
              {showSupplierForm && (
                <div className="inline-supplier-form">
                  <label>
                    Nome / razão social
                    <input required name="name" />
                  </label>
                  <label>
                    Nome fantasia
                    <input name="fantasyName" />
                  </label>
                  <label>
                    CPF ou CNPJ
                    <input name="document" />
                  </label>
                  <label>
                    Telefone
                    <input name="phone" />
                  </label>
                  <label>
                    WhatsApp
                    <input name="whatsapp" />
                  </label>
                  <label>
                    E-mail
                    <input name="email" type="email" />
                  </label>
                  <label>
                    Cidade / Estado
                    <input name="city" />
                  </label>
                  <label>
                    Produtos fornecidos
                    <input
                      name="products"
                      placeholder="Canecas, caixas, tintas"
                    />
                  </label>
                  <label className="wide">
                    Condições, prazo e observações
                    <textarea name="notes" />
                  </label>
                  <button
                    type="button"
                    onClick={createSupplier}
                  >
                    Salvar fornecedor
                  </button>
                </div>
              )}
              <div className="supplier-picker">
                {registeredSuppliers.length ? (
                  registeredSuppliers.map((supplier) => (
                    <article
                      className={
                        selectedSupplierIds.includes(supplier.id)
                          ? "selected"
                          : ""
                      }
                      key={supplier.id}
                    >
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedSupplierIds.includes(supplier.id)}
                          onChange={() => toggleSupplier(supplier.id)}
                        />
                        <span>
                          <b>{supplier.name}</b>
                          <small>
                            {supplier.fantasyName || supplier.code} •{" "}
                            {supplier.whatsapp || supplier.phone} •{" "}
                            {supplier.city}
                          </small>
                        </span>
                      </label>
                      <div>
                        {purchaseItems.map((item) => (
                          <label key={item.id}>
                            <input
                              type="checkbox"
                              checked={item.supplierIds.includes(supplier.id)}
                              onChange={() =>
                                toggleItemSupplier(item.id, supplier.id)
                              }
                              disabled={
                                !selectedSupplierIds.includes(supplier.id)
                              }
                            />
                            {item.name || item.code} ({item.quantity}{" "}
                            {item.unit})
                          </label>
                        ))}
                      </div>
                      <label className="file-field">
                        📎 Anexar proposta
                        <input type="file" multiple />
                      </label>
                    </article>
                  ))
                ) : (
                  <p>
                    Nenhum fornecedor cadastrado. Use “Cadastrar Novo
                    Fornecedor”.
                  </p>
                )}
              </div>
            </section>
            <div className="purchase-total">
              <span>Total estimado da compra</span>
              <b>
                R${" "}
                {purchaseItems
                  .reduce((sum, i) => sum + i.quantity * i.estimated, 0)
                  .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </b>
            </div>
            <div className="form-actions">
              <button type="button" onClick={() => setShowNew(false)}>
                Cancelar
              </button>
              <button className="primary" type="submit">
                Gerar Pedido de Compra e Ordens
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

export default function Home() {
  const [activeNav, setActiveNav] = useState("Visão geral");
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState(initialOrders);
  const [orderQuery, setOrderQuery] = useState("");
  const [orderView, setOrderView] = useState<
    "Orçamento" | "Pedido" | "Ordem de serviço"
  >("Pedido");
  const [orderModal, setOrderModal] = useState<"new" | "details" | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [modal, setModal] = useState<
    "new" | "edit" | "details" | "stock" | null
  >(null);
  const [selected, setSelected] = useState<Product | null>(null);
  const [actionsFor, setActionsFor] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [storeMenuOpen, setStoreMenuOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [storeQuery, setStoreQuery] = useState("");
  const [storeCategory, setStoreCategory] = useState("Todos");
  const [cart, setCart] = useState<
    { product: Product; quantity: number; variation: string }[]
  >([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [firstPurchase, setFirstPurchase] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [peopleTab, setPeopleTab] = useState<"Visão geral" | PersonKind>(
    "Visão geral",
  );
  const [peopleQuery, setPeopleQuery] = useState("");
  const [personModal, setPersonModal] = useState<
    "type" | "form" | "profile" | null
  >(null);
  const [newPersonType, setNewPersonType] = useState<PersonKind>("Cliente");
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [storeProduct, setStoreProduct] = useState<Product | null>(null);
  const [storeQuantity, setStoreQuantity] = useState(1);
  const [storeVariation, setStoreVariation] = useState("");
  const [orderDetails, setOrderDetails] = useState("");
  const [dataReady, setDataReady] = useState(false);
  const [centralDataLoaded, setCentralDataLoaded] = useState(false);
  const [arts, setArts] = useState(initialArts);
  const [artCategory, setArtCategory] = useState("Todas");
  const [selectedArtCode, setSelectedArtCode] = useState("");
  const [artModal, setArtModal] = useState<
    "new" | "buy" | "details" | "mockup" | null
  >(null);
  const [buyingArt, setBuyingArt] = useState<Art | null>(null);
  const [artQuery, setArtQuery] = useState("");
  const [artProduct, setArtProduct] = useState("Todos os produtos");
  const [artTheme, setArtTheme] = useState("Todos os temas");
  const [favoriteArts, setFavoriteArts] = useState<number[]>([]);
  const [mockupStatus, setMockupStatus] = useState<
    "idle" | "generating" | "ready"
  >("idle");
  const [newOrderCustomerId, setNewOrderCustomerId] = useState("");
  const [newOrderItems, setNewOrderItems] = useState<
    { productId: number; quantity: number }[]
  >([{ productId: initialProducts[0].id, quantity: 1 }]);
  const [standalonePayment, setStandalonePayment] = useState("");
  const [settings, setSettings] = useState(defaultSettings);
  const [productionOrder, setProductionOrder] = useState<Order | null>(null);
  const [nextProductionStatus, setNextProductionStatus] =
    useState<ProductionStatus | null>(null);
  const [productionNote, setProductionNote] = useState("");
  const [notifyCustomer, setNotifyCustomer] = useState(true);
  const [notificationChannel, setNotificationChannel] = useState("WhatsApp");
  const [productionFilter, setProductionFilter] = useState("Todos");
  const [persistenceStatus, setPersistenceStatus] = useState<
    "Carregando" | "Salvando" | "Salvo com sucesso" | "Erro ao salvar" | "Base indisponível"
  >("Carregando");
  const [auditHistory, setAuditHistory] = useState<AuditEntry[]>([]);
  const [newsletterName, setNewsletterName] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [shareStoreOpen, setShareStoreOpen] = useState(false);
  const [shareCustomerId, setShareCustomerId] = useState("");
  const [shareName, setShareName] = useState("");
  const [sharePhone, setSharePhone] = useState("");
  const [shareCampaign, setShareCampaign] = useState("WhatsApp");
  const [shareValidity, setShareValidity] = useState("");
  const [shareMessage, setShareMessage] = useState(
    "Olá, {NOME}! Conheça nossa Loja Virtual e escolha seus produtos personalizados: {LINK}",
  );
  const [storeLinks, setStoreLinks] = useState<StoreLinkHistory[]>([]);

  useEffect(() => {
    const mobileViewport = window.matchMedia("(max-width: 760px)");
    if (!menuOpen || !mobileViewport.matches) return;
    const sidebar = document.getElementById("main-navigation");
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const workspaces = Array.from(document.querySelectorAll<HTMLElement>(".workspace, .store-page"));
    const previousInert = workspaces.map((element) => element.inert);
    workspaces.forEach((element) => { element.inert = true; });
    document.body.style.overflow = "hidden";
    sidebar?.querySelector<HTMLButtonElement>(".sidebar-close")?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); setMenuOpen(false); }
      if (event.key !== "Tab") return;
      const buttons = Array.from(sidebar?.querySelectorAll<HTMLButtonElement>("button:not([disabled])") ?? []);
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    const handleViewportChange = () => { if (!mobileViewport.matches) setMenuOpen(false); };
    mobileViewport.addEventListener("change", handleViewportChange);
    document.addEventListener("keydown", handleKey);
    return () => {
      mobileViewport.removeEventListener("change", handleViewportChange);
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
      workspaces.forEach((element, index) => { element.inert = previousInert[index]; });
      previousFocus?.focus();
    };
  }, [menuOpen]);

  useEffect(() => {
    queueMicrotask(async () => {
      try {
        let localSaved = window.localStorage.getItem(STORAGE_KEY);
        if (!localSaved) localSaved = window.localStorage.getItem(BACKUP_KEY);
        const response = await fetch("/api/system-data", { cache: "no-store", signal: AbortSignal.timeout(15000) });
        if (!response.ok) throw new Error("Falha ao consultar a base central.");
        const remote = (await response.json()) as { data: SavedSystemData | null };
        const data = remote.data ?? (localSaved ? JSON.parse(localSaved) : null);
        if (data) {
          if (Array.isArray(data.products)) setProducts(data.products);
          if (Array.isArray(data.orders)) setOrders(data.orders);
          if (Array.isArray(data.customers))
            setCustomers(data.customers as Customer[]);
          if (Array.isArray(data.people)) setPeople(data.people);
          if (Array.isArray(data.arts)) setArts(data.arts);
          if (data.settings)
            setSettings({
              ...defaultSettings,
              ...data.settings,
              footer: {
                ...defaultFooter,
                ...data.settings.footer,
                socialsActive: {
                  ...defaultFooter.socialsActive,
                  ...data.settings.footer?.socialsActive,
                },
                payments: {
                  ...defaultFooter.payments,
                  ...data.settings.footer?.payments,
                },
              },
            });

          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          if (!remote.data) {
            const migrationResponse = await fetch("/api/system-data", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            });
            if (!migrationResponse.ok) throw new Error("Falha ao importar a cópia local.");
          }
        }
        const audit = JSON.parse(
          window.localStorage.getItem(AUDIT_KEY) || "[]",
        );
        if (Array.isArray(audit)) setAuditHistory(audit);
        setCentralDataLoaded(true);
      } catch {
        setPersistenceStatus("Base indisponível");
        try {
          const fallback = window.localStorage.getItem(STORAGE_KEY);
          if (fallback) {
            const data = JSON.parse(fallback) as SavedSystemData;
            if (Array.isArray(data.products)) setProducts(data.products);
            if (Array.isArray(data.orders)) setOrders(data.orders);
            if (Array.isArray(data.customers)) setCustomers(data.customers as Customer[]);
            if (Array.isArray(data.people)) setPeople(data.people);
            if (Array.isArray(data.arts)) setArts(data.arts);
            if (data.settings) setSettings({ ...defaultSettings, ...data.settings });
          }
        } catch {
          // Mantém os dados padrão se a base central e a cópia local estiverem indisponíveis.
        }
      } finally {
        setDataReady(true);
      }
    });
  }, []);

  useEffect(() => {
    // Never upload fallback or sample data after an unsuccessful central read.
    if (!dataReady || !centralDataLoaded) return;
    const saveTimer = window.setTimeout(async () => {
      try {
      setPersistenceStatus("Salvando");
      const previous = JSON.parse(
        window.localStorage.getItem(STORAGE_KEY) || "{}",
      ) as SavedSystemData;
      if (previous && Object.keys(previous).length)
        window.localStorage.setItem(BACKUP_KEY, JSON.stringify(previous));
      const nextData = {
        ...previous,
        products,
        orders,
        customers,
        people,
        arts,
        settings,
        schemaVersion: DATA_SCHEMA_VERSION,
        savedAt: new Date().toISOString(),
        additionalInformation: previous.additionalInformation ?? {},
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData));
      const response = await fetch("/api/system-data", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextData),
      });
      if (!response.ok) throw new Error("Falha ao sincronizar a base central.");
      setPersistenceStatus("Salvo com sucesso");
      } catch {
        setPersistenceStatus("Erro ao salvar");
        notify("Não foi possível sincronizar os dados com o Painel Administrativo.");
      }
    }, 600);

    return () => window.clearTimeout(saveTimer);
  }, [dataReady, centralDataLoaded, products, orders, customers, people, arts, settings]);

  useEffect(() => {
    if (!dataReady || !customers.length) return;
    setPeople((current) => {
      const known = new Set(
        current.filter((p) => p.types.includes("Cliente")).map((p) => p.id),
      );
      const migrated = customers
        .filter((c) => !known.has(c.id))
        .map<Person>((c) => ({
          id: c.id,
          code: `PES-${String(c.id).padStart(5, "0")}`,
          types: ["Cliente"],
          name: c.name,
          phone: c.phone,
          whatsapp: c.phone,
          email: c.email,
          city: c.city,
          tags: ["Cliente"],
          notes: c.notes,
          status: "Ativo",
          createdAt: c.createdAt,
          orderCount: c.orderCount,
        }));
      return migrated.length ? [...current, ...migrated] : current;
    });
  }, [dataReady, customers]);

  useEffect(() => {
    if (!dataReady) return;
    const proofOrderId = new URLSearchParams(window.location.search).get(
      "comprovante",
    );
    if (!proofOrderId) return;
    const order = orders.find((item) => item.id === proofOrderId);
    if (order) {
      setActiveNav("Pedidos");
      setSelectedOrder(order);
      setOrderModal("details");
    }
  }, [dataReady]);

  const filtered = useMemo(
    () =>
      products.filter((p) => {
        const matches = `${p.name} ${p.code} ${p.category}`
          .toLowerCase()
          .includes(query.toLowerCase());
        const status =
          filter === "Todos" ||
          (filter === "Ativos" && p.stock > 0) ||
          (filter === "Estoque baixo" && p.stock <= p.minStock);
        return matches && status;
      }),
    [products, query, filter],
  );

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  }

  function readOriginalFile(file: File): Promise<PersonAttachment> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () =>
        resolve({
          id: Date.now() + Math.random(),
          name: file.name,
          type: file.type || "application/octet-stream",
          size: file.size,
          dataUrl: String(reader.result),
          uploadedAt: new Date().toLocaleString("pt-BR"),
          originalQuality: true,
        });
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  async function attachFilesToPerson(person: Person, files: FileList | null) {
    if (!files?.length) return;
    try {
      const attachments = await Promise.all(
        Array.from(files).map(readOriginalFile),
      );
      const updated = {
        ...person,
        attachments: [...(person.attachments || []), ...attachments],
      };
      setPeople((current) =>
        current.map((p) => (p.id === person.id ? updated : p)),
      );
      setSelectedPerson(updated);
      registerAudit(
        "Arquivos anexados",
        "Pessoas",
        `${attachments.length} arquivo(s) original(is) em ${person.code}`,
      );
      notify(`${attachments.length} arquivo(s) anexado(s) sem compressão.`);
    } catch {
      notify("Não foi possível anexar um dos arquivos.");
    }
  }

  function registerAudit(action: string, module: string, details: string) {
    const entry: AuditEntry = {
      id: Date.now(),
      date: new Date().toLocaleString("pt-BR"),
      action,
      module,
      details,
      user: "Administrador",
    };
    setAuditHistory((current) => {
      const next = [entry, ...current].slice(0, 100);
      window.localStorage.setItem(AUDIT_KEY, JSON.stringify(next));
      return next;
    });
  }

  function createManualBackup() {
    const current = window.localStorage.getItem(STORAGE_KEY);
    if (!current) {
      notify("Ainda não há dados para copiar.");
      return;
    }
    window.localStorage.setItem(BACKUP_KEY, current);
    registerAudit(
      "Backup criado",
      "Sistema",
      "Cópia de segurança manual antes de atualização",
    );
    notify("Cópia de segurança criada com sucesso.");
  }

  function restoreBackup() {
    const backup = window.localStorage.getItem(BACKUP_KEY);
    if (!backup) {
      notify("Nenhuma versão anterior disponível.");
      return;
    }
    if (
      !window.confirm(
        "Restaurar a versão anterior? Os dados atuais serão preservados como cópia de segurança.",
      )
    )
      return;
    const current = window.localStorage.getItem(STORAGE_KEY);
    if (current)
      window.localStorage.setItem(`${BACKUP_KEY}:before-restore`, current);
    window.localStorage.setItem(STORAGE_KEY, backup);
    registerAudit(
      "Versão restaurada",
      "Sistema",
      "Restauração administrativa confirmada",
    );
    window.location.reload();
  }

  function subscribeNewsletter(event: React.FormEvent) {
    event.preventDefault();
    if (!newsletterName.trim() || !newsletterEmail.includes("@")) {
      notify("Informe nome e e-mail válidos.");
      return;
    }
    setCustomers((current) => {
      if (
        current.some(
          (c) => c.email.toLowerCase() === newsletterEmail.toLowerCase(),
        )
      )
        return current;
      return [
        ...current,
        {
          id: Date.now(),
          name: newsletterName,
          phone: "",
          email: newsletterEmail,
          city: "",
          notes: "Contato cadastrado pela newsletter da Loja Virtual",
          createdAt: new Date().toLocaleDateString("pt-BR"),
          orderCount: 0,
        },
      ];
    });
    registerAudit(
      "Contato cadastrado",
      "CRM / Marketing",
      `${newsletterName} • ${newsletterEmail}`,
    );
    setNewsletterName("");
    setNewsletterEmail("");
    notify("Cadastro realizado! Você receberá nossas novidades.");
  }

  async function saveProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name"));
    const category = String(data.get("category"));
    const next = products.length + 1;
    const files = data
      .getAll("images")
      .filter((item): item is File => item instanceof File && item.size > 0);
    const newImages = await Promise.all(
      files.map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.onerror = reject;
            reader.readAsDataURL(file);
          }),
      ),
    );
    const images = [...(selected?.images ?? []), ...newImages];
    const product: Product = {
      id: selected?.id ?? Date.now(),
      name,
      category,
      code: selected?.code ?? `TOP-${String(next).padStart(3, "0")}`,
      stock: Number(data.get("stock")),
      minStock: Number(data.get("minStock")),
      retailPrice: Number(data.get("retailPrice")),
      wholesalePrice: Number(data.get("wholesalePrice")),
      wholesaleMin: Number(data.get("wholesaleMin")),
      variations: String(data.get("variations"))
        .split("\n")
        .map((v) => v.trim())
        .filter(Boolean),
      art: selected?.art ?? "Sem arte",
      gradient: selected?.gradient ?? "coral",
      emoji: selected?.emoji ?? "🎁",
      images,
    };
    setProducts(
      selected
        ? products.map((p) => (p.id === selected.id ? product : p))
        : [product, ...products],
    );
    setModal(null);
    setSelected(null);
    notify(
      selected
        ? "Produto atualizado com sucesso!"
        : "Produto cadastrado com sucesso!",
    );
  }

  function openModal(
    mode: "new" | "edit" | "details" | "stock",
    product?: Product,
  ) {
    setSelected(product ?? null);
    setModal(mode);
    setActionsFor(null);
    setCarouselIndex(0);
  }
  function duplicateProduct(product: Product) {
    setProducts([
      {
        ...product,
        id: Date.now(),
        name: `${product.name} (cópia)`,
        code: `${product.code}-C`,
      },
      ...products,
    ]);
    setActionsFor(null);
    notify("Produto duplicado com todas as variações!");
  }
  function deleteProduct(product: Product) {
    if (
      window.confirm(
        `Atenção: esta ação poderá apagar dados existentes. Deseja realmente excluir ${product.name}? Uma cópia de segurança será criada antes.`,
      )
    ) {
      createManualBackup();
      setProducts(products.filter((p) => p.id !== product.id));
      registerAudit(
        "Registro excluído",
        "Produtos",
        `${product.code} • ${product.name} • exclusão confirmada pelo administrador`,
      );
      notify("Produto excluído.");
    }
    setActionsFor(null);
  }
  function adjustStock(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    const data = new FormData(event.currentTarget);
    const amount = Number(data.get("amount"));
    const operation = String(data.get("operation"));
    setProducts(
      products.map((p) =>
        p.id === selected.id
          ? {
              ...p,
              stock: Math.max(
                0,
                operation === "entrada" ? p.stock + amount : p.stock - amount,
              ),
            }
          : p,
      ),
    );
    setModal(null);
    notify("Estoque atualizado com histórico registrado!");
  }

  const orderTotal = (order: Order) =>
    order.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const documentType = (order: Order) => order.documentType ?? "Pedido";
  const visibleOrders = orders.filter(
    (order) =>
      documentType(order) === orderView &&
      `${order.id} ${order.customer} ${order.phone}`
        .toLowerCase()
        .includes(orderQuery.toLowerCase()),
  );
  const financeOrders = orders.filter(
    (order) => documentType(order) === "Pedido",
  );
  const financeTotal = financeOrders.reduce(
    (sum, order) => sum + orderTotal(order),
    0,
  );
  const financeReceived = financeOrders.reduce(
    (sum, order) =>
      sum +
      (order.amountPaid ?? (order.payment === "Pago" ? orderTotal(order) : 0)),
    0,
  );

  function addNewOrderItem() {
    setNewOrderItems((current) => [
      ...current,
      { productId: products[0]?.id ?? 0, quantity: 1 },
    ]);
  }

  function updateNewOrderItem(
    index: number,
    changes: Partial<{ productId: number; quantity: number }>,
  ) {
    setNewOrderItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...changes } : item,
      ),
    );
  }

  function removeNewOrderItem(index: number) {
    setNewOrderItems((current) =>
      current.length === 1
        ? current
        : current.filter((_, itemIndex) => itemIndex !== index),
    );
  }

  function newOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const kind = String(data.get("documentType")) as Order["documentType"];
    const prefix =
      kind === "Orçamento" ? "ORC" : kind === "Ordem de serviço" ? "OS" : "PED";
    const customer = customers.find(
      (item) => String(item.id) === String(data.get("customerId")),
    );
    if (!customer) {
      notify("Selecione um cliente cadastrado.");
      return;
    }
    const items = newOrderItems.map((item) => {
      const product =
        products.find((productItem) => productItem.id === item.productId) ??
        products[0];
      return {
        name: product.name,
        variation: product.variations[0] ?? "Padrão",
        quantity: item.quantity,
        unitPrice:
          item.quantity >= product.wholesaleMin
            ? product.wholesalePrice
            : product.retailPrice,
      };
    });
    const total = items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );
    const dueRaw = String(data.get("quoteDueDate") || "");
    const automaticDue = new Date();
    automaticDue.setDate(automaticDue.getDate() + settings.quoteValidity);
    const entryPercent = Math.max(
      1,
      Math.min(100, Number(data.get("entryPercent") || 50)),
    );
    const order: Order = {
      id: `${prefix}-${1049 + orders.length}`,
      customer: customer.name,
      phone: customer.phone,
      customerData: {
        email: customer.email,
        city: customer.city,
        notes: customer.notes,
      },
      date: new Date().toLocaleDateString("pt-BR"),
      delivery: new Date(
        String(data.get("delivery")) + "T12:00:00",
      ).toLocaleDateString("pt-BR"),
      status: kind === "Orçamento" ? "Aguardando confirmação" : "Novo",
      payment: "Pendente",
      documentType: kind,
      amountPaid: 0,
      quoteDueDate: dueRaw || automaticDue.toISOString().slice(0, 10),
      paymentDetails: String(
        data.get("paymentDetails") || settings.pixKey || "",
      ),
      entryPercent,
      paymentExpected: total * (entryPercent / 100),
      paymentVerification: "Sem comprovante",
      payments: [],
      items,
    };
    setOrders([order, ...orders]);
    setOrderModal(null);
    setSelectedOrder(null);
    setNewOrderItems([{ productId: products[0]?.id ?? 0, quantity: 1 }]);
    notify("Pedido com todos os produtos criado com sucesso!");
  }

  function approveQuote(order: Order) {
    const number =
      Math.max(
        1048,
        ...orders.map((item) => Number(item.id.replace(/\D/g, "")) || 0),
      ) + 1;
    const approved = {
      ...order,
      id: `PED-${number}`,
      documentType: "Pedido" as const,
      status: "Novo" as const,
    };
    setOrders((current) =>
      current.map((item) => (item.id === order.id ? approved : item)),
    );
    setSelectedOrder(approved);
    setOrderView("Pedido");
    notify("Orçamento aprovado e enviado para Pedidos e Produção!");
  }

  function updatePayment(
    order: Order,
    mode: "Entrada" | "Restante" | "Concluído",
  ) {
    const total = orderTotal(order);
    const amountPaid =
      mode === "Entrada" ? Math.max(order.amountPaid ?? 0, total * 0.5) : total;
    const payment: Order["payment"] = mode === "Entrada" ? "Parcial" : "Pago";
    const updated = { ...order, amountPaid, payment };
    setOrders((current) =>
      current.map((item) => (item.id === order.id ? updated : item)),
    );
    setSelectedOrder(updated);
    notify(
      mode === "Entrada"
        ? "Entrada registrada. Saldo restante atualizado!"
        : "Pagamento concluído!",
    );
  }

  function addStandalonePayment(order: Order) {
    const amount = Number(standalonePayment.replace(",", "."));
    if (!amount || amount <= 0) {
      notify("Informe um valor avulso válido.");
      return;
    }
    const total = orderTotal(order);
    const payments = [
      ...(order.payments ?? []),
      {
        id: Date.now(),
        amount,
        note: "Pagamento avulso",
        date: new Date().toLocaleDateString("pt-BR"),
      },
    ];
    const amountPaid = Math.min(total, (order.amountPaid ?? 0) + amount);
    const updated: Order = {
      ...order,
      payments,
      amountPaid,
      payment: amountPaid >= total ? "Pago" : "Parcial",
    };
    setOrders((current) =>
      current.map((item) => (item.id === order.id ? updated : item)),
    );
    setSelectedOrder(updated);
    setStandalonePayment("");
    notify("Pagamento avulso registrado no pedido e no Financeiro.");
  }

  async function attachPaymentProof(order: Order, file?: File) {
    if (!file) return;
    if (file.size > 4_000_000) {
      notify("O comprovante deve ter no máximo 4 MB.");
      return;
    }
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    const updated: Order = {
      ...order,
      paymentProof: {
        name: file.name,
        dataUrl,
        uploadedAt: new Date().toLocaleString("pt-BR"),
      },
      paymentVerification: "Aguardando verificação",
      paymentAudit: [
        {
          action: "Pagamento aguardando verificação",
          date: new Date().toLocaleString("pt-BR"),
          user: order.customer,
          note: file.name,
        },
        ...(order.paymentAudit || []),
      ],
    };
    setOrders((current) =>
      current.map((item) => (item.id === order.id ? updated : item)),
    );
    setSelectedOrder(updated);
    notify("Comprovante enviado. O Financeiro fará a verificação.");
  }

  function verifyPayment(
    order: Order,
    result: "Pagamento confirmado" | "Pagamento rejeitado",
  ) {
    if (
      result === "Pagamento confirmado" &&
      !window.confirm(
        "Confirma a aprovação deste pagamento? Ao confirmar, o valor será lançado no Financeiro e o status da Produção será atualizado.",
      )
    )
      return;
    const reason =
      result === "Pagamento rejeitado"
        ? window.prompt(
            "Informe o motivo da reprovação:",
            "Comprovante ilegível",
          ) || ""
        : "";
    if (result === "Pagamento rejeitado" && !reason) return;
    const approvedValue = order.paymentExpected || orderTotal(order) * 0.5;
    const updated: Order = {
      ...order,
      paymentVerification: result,
      rejectionReason: reason || undefined,
      ...(result === "Pagamento confirmado"
        ? {
            amountPaid: Math.max(order.amountPaid || 0, approvedValue),
            payment:
              approvedValue >= orderTotal(order)
                ? ("Pago" as const)
                : ("Parcial" as const),
            productionStatus: "Pagamento confirmado" as const,
            paymentConfirmedAt: new Date().toLocaleString("pt-BR"),
            paymentConfirmedBy: "Administrador",
            financePosted: true,
          }
        : {}),
      paymentAudit: [
        {
          action: result,
          date: new Date().toLocaleString("pt-BR"),
          user: "Administrador",
          note: reason || "Entrada lançada no Financeiro e Produção atualizada",
        },
        ...(order.paymentAudit || []),
      ],
    };
    setOrders((current) =>
      current.map((item) => (item.id === order.id ? updated : item)),
    );
    setSelectedOrder(updated);
    notify(
      result === "Pagamento confirmado"
        ? "Pagamento aprovado, lançado no Financeiro, Produção atualizada e cliente notificado!"
        : "Pagamento reprovado sem lançamento financeiro. O cliente foi notificado.",
    );
  }

  async function copyPix(value: string, label: string) {
    await navigator.clipboard.writeText(value);
    notify(`${label} copiado com sucesso!`);
  }
  function openPix(order: Order) {
    const code = order.paymentDetails || settings.pixKey;
    if (!code) {
      notify("Cadastre a chave PIX em Configurações.");
      return;
    }
    void copyPix(code, "Código PIX");
    notify("Código PIX copiado. Abra o aplicativo do seu banco para pagar.");
  }

  async function copyProofLink(order: Order) {
    const url = `${window.location.origin}${window.location.pathname}?comprovante=${encodeURIComponent(order.id)}`;
    await navigator.clipboard.writeText(url);
    notify("Link para anexar comprovante copiado!");
  }

  function sendOrderWhatsApp(order: Order) {
    const phone = order.phone.replace(/\D/g, "");
    const total = orderTotal(order).toFixed(2).replace(".", ",");
    const message = `Olá, ${order.customer}! Segue ${documentType(order).toLowerCase()} ${order.id}, no valor total de R$ ${total}.`;
    window.open(
      `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  async function makePdf(order: Order, action: "download" | "share") {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 210, 32, "F");
    try {
      const logoBlob = await fetch("/assets/topstampp-logo.png").then(
        (response) => response.blob(),
      );
      const logoData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(logoBlob);
      });
      doc.addImage(logoData, "PNG", 16, 5, 53, 22, undefined, "FAST");
    } catch {
      doc.setTextColor(35, 28, 45);
      doc.setFontSize(18);
      doc.text("TOPSTAMP PERSONALIZADOS", 16, 20);
    }
    doc.setTextColor(30, 30, 34);
    doc.setFontSize(16);
    doc.text(`Pedido ${order.id}`, 16, 48);
    doc.setFontSize(10);
    doc.text(`Cliente: ${order.customer}`, 16, 59);
    doc.text(`Telefone: ${order.phone}`, 16, 66);
    doc.text(`Data: ${order.date}   Entrega: ${order.delivery}`, 16, 73);
    doc.setDrawColor(230, 220, 210);
    doc.line(16, 82, 194, 82);
    let y = 94;
    order.items.forEach((item) => {
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(item.name, 16, y);
      doc.setFont("helvetica", "normal");
      doc.text(
        `${item.variation} | ${item.quantity} un. x R$ ${item.unitPrice.toFixed(2).replace(".", ",")}`,
        16,
        y + 7,
      );
      doc.text(
        `R$ ${(item.quantity * item.unitPrice).toFixed(2).replace(".", ",")}`,
        194,
        y + 7,
        { align: "right" },
      );
      y += 22;
    });
    doc.setFillColor(245, 240, 250);
    doc.roundedRect(120, y, 74, 20, 3, 3, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(
      `Total: R$ ${orderTotal(order).toFixed(2).replace(".", ",")}`,
      188,
      y + 13,
      { align: "right" },
    );
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Obrigado pela preferência!", 105, 282, { align: "center" });
    if (action === "share") {
      const file = new File([doc.output("blob")], `${order.id}.pdf`, {
        type: "application/pdf",
      });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: `Pedido ${order.id}`,
          text: `Pedido de ${order.customer}`,
          files: [file],
        });
        notify("PDF enviado para compartilhamento!");
        return;
      }
      doc.save(`${order.id}.pdf`);
      notify("PDF baixado. Compartilhe pelo WhatsApp ou e-mail.");
      return;
    }
    doc.save(`${order.id}.pdf`);
    notify("PDF gerado e baixado com sucesso!");
  }

  function printOrder(order: Order) {
    setSelectedOrder(order);
    window.setTimeout(() => window.print(), 150);
  }

  const storeProducts = products.filter(
    (p) =>
      p.stock > 0 &&
      (storeCategory === "Todos" || p.category === storeCategory) &&
      `${p.name} ${p.category}`
        .toLowerCase()
        .includes(storeQuery.toLowerCase()),
  );
  const categories = [
    "Todos",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce(
    (sum, item) =>
      sum +
      item.quantity *
        (item.quantity >= item.product.wholesaleMin
          ? item.product.wholesalePrice
          : item.product.retailPrice),
    0,
  );
  const firstPurchaseDiscount = firstPurchase ? cartTotal * 0.1 : 0;
  const finalCartTotal = cartTotal - firstPurchaseDiscount;
  const publicStoreLink =
    typeof window === "undefined"
      ? "https://loja.topstampp.com.br"
      : `${window.location.origin}/?loja=cliente`;
  function selectShareCustomer(id: string) {
    setShareCustomerId(id);
    const customer = customers.find((item) => String(item.id) === id);
    if (customer) {
      setShareName(customer.name);
      setSharePhone(customer.phone);
    }
  }
  function personalizedStoreLink() {
    const token = shareCustomerId
      ? btoa(`${shareCustomerId}:${Date.now()}`)
          .replace(/=|\+|\//g, "")
          .slice(0, 18)
      : "";
    const params = new URLSearchParams({ origem: shareCampaign || "direto" });
    if (token) params.set("acesso", token);
    if (shareValidity) params.set("validade", shareValidity);
    return `${publicStoreLink}&${params.toString()}`;
  }
  function logStoreLink(
    status: StoreLinkHistory["status"],
    link = personalizedStoreLink(),
  ) {
    setStoreLinks((current) => [
      {
        id: Date.now(),
        customer: shareName || "Contato avulso",
        phone: sharePhone,
        link,
        campaign: shareCampaign,
        status,
        sentAt: new Date().toLocaleString("pt-BR"),
        accesses: 0,
        lastAccess: "—",
        order: "—",
        value: 0,
      },
      ...current,
    ]);
    registerAudit(
      status,
      "Loja Virtual",
      `${shareName || "Contato avulso"} • ${shareCampaign}`,
    );
    return link;
  }
  async function copyStoreLink() {
    const link = personalizedStoreLink();
    await navigator.clipboard.writeText(link);
    logStoreLink("Link criado", link);
    notify("Link da loja copiado com segurança!");
  }
  function sendStoreLink() {
    const digits = sharePhone.replace(/\D/g, "");
    if (!digits) return notify("Selecione um cliente ou informe o WhatsApp.");
    const link = personalizedStoreLink();
    const message = shareMessage
      .replaceAll("{NOME}", shareName || "cliente")
      .replaceAll("{LINK}", link);
    logStoreLink("Link enviado", link);
    window.open(
      `https://wa.me/${digits.startsWith("55") ? digits : `55${digits}`}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }
  async function nativeShareStore() {
    const link = personalizedStoreLink();
    if (navigator.share)
      await navigator.share({
        title: settings.businessName,
        text: "Conheça nossa Loja Virtual",
        url: link,
      });
    else await copyStoreLink();
  }
  function addToCart(product: Product) {
    setCart((current) => {
      const found = current.find((item) => item.product.id === product.id);
      return found
        ? current.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          )
        : [
            ...current,
            {
              product,
              quantity: 1,
              variation: product.variations[0] ?? "Padrão",
            },
          ];
    });
    notify(`${product.name} adicionado ao orçamento!`);
  }
  function openStoreProduct(product: Product) {
    setStoreProduct(product);
    setStoreQuantity(1);
    setStoreVariation(product.variations[0] ?? "Padrão");
    setSelectedArtCode("");
    setOrderDetails("");
  }
  function addConfiguredProduct() {
    if (!storeProduct) return;
    setCart((current) => {
      const found = current.find(
        (item) =>
          item.product.id === storeProduct.id &&
          item.variation === storeVariation,
      );
      return found
        ? current.map((item) =>
            item === found
              ? { ...item, quantity: item.quantity + storeQuantity }
              : item,
          )
        : [
            ...current,
            {
              product: storeProduct,
              quantity: storeQuantity,
              variation: storeVariation,
            },
          ];
    });
    const art = arts.find((item) => item.code === selectedArtCode);
    if (art)
      setOrderDetails(
        (current) =>
          `${current}${current ? "\n" : ""}Arte selecionada: ${art.code} — ${art.name}`,
      );
    setStoreProduct(null);
    notify(
      art
        ? `Produto cadastrado com a arte ${art.code}!`
        : "Produto personalizado adicionado ao carrinho!",
    );
  }
  function saveArt(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const code = `ART-${String(Date.now()).slice(-6)}`;
    setArts((current) => [
      {
        id: Date.now(),
        code,
        name: String(data.get("name")),
        category: String(data.get("category")),
        price: Number(data.get("price")),
        active: true,
        emoji: "🎨",
        gradient: "purple",
        theme: String(data.get("theme") || "Geral"),
        style: String(data.get("style") || "Personalizada"),
        compatibleCategories: data.getAll("compatibleCategories").map(String),
        customizable: String(data.get("customizable") || "")
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean),
        new: true,
      },
      ...current,
    ]);
    setArtModal(null);
    notify(`Arte ${code} cadastrada!`);
  }
  function requestArtPurchase(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!buyingArt) return;
    const data = new FormData(event.currentTarget);
    const phone = String(data.get("phone"));
    const message = `Olá, TopStamp! Quero comprar a arte avulsa ${buyingArt.code} — ${buyingArt.name}, no valor de R$ ${buyingArt.price.toFixed(2).replace(".", ",")}.\n\nCliente: ${String(data.get("name"))}\nWhatsApp cadastrado: ${phone}\n\nEntendi que a arte não fica disponível para baixar agora. Após a confirmação do pagamento, receberei pelo WhatsApp um link individual com permissão para download.`;
    window.open(
      `https://wa.me/5562920004609?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
    setArtModal(null);
    setBuyingArt(null);
    notify("Solicitação registrada. Download bloqueado até o pagamento.");
  }
  function finishStoreOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!cart.length) {
      notify("Adicione pelo menos um produto.");
      return;
    }
    const data = new FormData(event.currentTarget);
    const phone = String(data.get("phone"));
    const customer: Customer = {
      id: Date.now(),
      name: String(data.get("name")),
      phone,
      email: String(data.get("email")),
      city: String(data.get("city")),
      notes: String(data.get("details")),
      createdAt: new Date().toLocaleDateString("pt-BR"),
      orderCount: 1,
    };
    setCustomers((current) => {
      const existing = current.find((c) => c.phone === phone);
      return existing
        ? current.map((c) =>
            c.phone === phone
              ? { ...c, ...customer, id: c.id, orderCount: c.orderCount + 1 }
              : c,
          )
        : [customer, ...current];
    });
    const orderNumber =
      Math.max(
        1048,
        ...orders.map((order) => Number(order.id.replace(/\D/g, "")) || 0),
      ) + 1;
    const orderId = `PED-${orderNumber}`;
    const storeOrder: Order = {
      id: orderId,
      customer: customer.name,
      phone: customer.phone,
      date: new Date().toLocaleDateString("pt-BR"),
      delivery: "A confirmar",
      status: "Aguardando confirmação",
      payment: "Pendente",
      items: cart.map((item) => ({
        name: item.product.name,
        variation: item.variation,
        quantity: item.quantity,
        unitPrice:
          item.quantity >= item.product.wholesaleMin
            ? item.product.wholesalePrice
            : item.product.retailPrice,
      })),
    };
    setOrders((current) => [storeOrder, ...current]);
    const lines = cart
      .map(
        (item) =>
          `• ${item.product.name} — ${item.variation} — ${item.quantity} un.`,
      )
      .join("\n");
    const discountLine = firstPurchase
      ? `\nDesconto de primeira compra (10%): - R$ ${firstPurchaseDiscount.toFixed(2).replace(".", ",")}`
      : "";
    const message = `NOVO PEDIDO DA LOJA VIRTUAL — ${orderId}\n\nCliente: ${customer.name}\nWhatsApp: ${customer.phone}\nCidade: ${customer.city}\n\n${lines}\n\nSubtotal: R$ ${cartTotal.toFixed(2).replace(".", ",")}${discountLine}\nTotal estimado: R$ ${finalCartTotal.toFixed(2).replace(".", ",")}\n\nDetalhes: ${customer.notes || "Sem observações"}\nStatus: Aguardando confirmação`;
    window.open(
      `https://wa.me/5562920004609?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
    setCart([]);
    setCartOpen(false);
    setOrderDetails("");
    notify(`${orderId} cadastrado e enviado ao WhatsApp!`);
  }
  function updateCart(id: number, quantity: number) {
    setCart((current) =>
      quantity < 1
        ? current.filter((item) => item.product.id !== id)
        : current.map((item) =>
            item.product.id === id ? { ...item, quantity } : item,
          ),
    );
  }
  function sendWhatsApp(mode: "orcamento" | "compra") {
    if (!cart.length) {
      notify("Adicione pelo menos um produto.");
      return;
    }
    const lines = cart
      .map(
        (item) =>
          `• ${item.product.name} — ${item.variation} — ${item.quantity} un.`,
      )
      .join("\n");
    const discountLine = firstPurchase
      ? `\nDesconto de primeira compra (10%): - R$ ${firstPurchaseDiscount.toFixed(2).replace(".", ",")}`
      : "";
    const message = `Olá, TopStamp! Quero ${mode === "compra" ? "solicitar esta compra" : "receber um orçamento"}:\n\n${lines}\n\nSubtotal: R$ ${cartTotal.toFixed(2).replace(".", ",")}${discountLine}\nTotal estimado: R$ ${finalCartTotal.toFixed(2).replace(".", ",")}\n\nPode confirmar prazo, arte e entrega?`;
    if (mode === "compra") {
      document
        .getElementById("customer-checkout")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      notify("Preencha os dados para finalizar a compra.");
      return;
    }
    window.open(
      `https://wa.me/5562920004609?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }
  function moveProduction(order: Order, status: Order["status"]) {
    setOrders((current) =>
      current.map((item) =>
        item.id === order.id ? { ...item, status } : item,
      ),
    );
    notify(`${order.id} atualizado para ${status}.`);
  }

  function currentProductionStatus(order: Order): ProductionStatus {
    if (order.productionStatus) return order.productionStatus;
    if (order.status === "Arte pendente") return "Aguardando aprovação da arte";
    if (order.status === "Em produção") return "Em preparação";
    if (order.status === "Pronto") return "Pronto para retirada";
    return "Pedido recebido";
  }

  function confirmProductionStatus() {
    if (!productionOrder || !nextProductionStatus) return;
    if (
      ["Produção pausada", "Cancelado"].includes(nextProductionStatus) &&
      !productionNote.trim()
    ) {
      notify("Informe o motivo ou observação para continuar.");
      return;
    }
    const previous = currentProductionStatus(productionOrder);
    const mapped: Order["status"] =
      nextProductionStatus === "Entregue" ||
      nextProductionStatus.startsWith("Pronto")
        ? "Pronto"
        : nextProductionStatus.includes("Arte") &&
            !nextProductionStatus.includes("aprovada")
          ? "Arte pendente"
          : [
                "Em preparação",
                "Em impressão",
                "Em corte",
                "Em sublimação",
                "Em prensagem",
                "Em montagem",
                "Em acabamento",
                "Em conferência",
                "Em embalagem",
              ].includes(nextProductionStatus)
            ? "Em produção"
            : productionOrder.status;
    const entry: ProductionHistory = {
      status: nextProductionStatus,
      previous,
      date: new Date().toLocaleString("pt-BR"),
      user: "Administrador",
      note: productionNote,
      notified: notifyCustomer,
      channel: notifyCustomer ? notificationChannel : "Não enviado",
    };
    const updated = {
      ...productionOrder,
      status: mapped,
      productionStatus: nextProductionStatus,
      productionHistory: [entry, ...(productionOrder.productionHistory || [])],
    };
    setOrders((current) =>
      current.map((o) => (o.id === updated.id ? updated : o)),
    );
    setProductionOrder(updated);
    setNextProductionStatus(null);
    setProductionNote("");
    notify(
      notifyCustomer
        ? `Status atualizado e cliente notificado por ${notificationChannel}.`
        : "Status atualizado e registrado no histórico.",
    );
  }

  const footer = settings.footer;
  const cleanPhone = (value: string) => value.replace(/\D/g, "");
  const companyAddress = [footer.address, footer.city, footer.state, footer.cep]
    .filter(Boolean)
    .join(" • ");
  const mainCategories = Array.from(
    new Set(products.map((product) => product.category)),
  ).slice(0, 8);
  const socialNetworks: { key: SocialKey; label: string; mark: string }[] = [
    { key: "instagram", label: "Instagram", mark: "◎" },
    { key: "facebook", label: "Facebook", mark: "f" },
    { key: "pinterest", label: "Pinterest", mark: "p" },
    { key: "tiktok", label: "TikTok", mark: "♪" },
    { key: "youtube", label: "YouTube", mark: "▶" },
    { key: "linkedin", label: "LinkedIn", mark: "in" },
    { key: "twitter", label: "X", mark: "X" },
    { key: "threads", label: "Threads", mark: "@" },
    { key: "telegram", label: "Telegram", mark: "➤" },
  ];
  const activeSocials = socialNetworks.filter(
    (network) => footer.socialsActive[network.key] && footer[network.key],
  );
  const paymentLabels: {
    key: keyof FooterSettings["payments"];
    label: string;
    mark: string;
  }[] = [
    { key: "pix", label: "PIX", mark: "◆" },
    { key: "credit", label: "Crédito", mark: "▰" },
    { key: "debit", label: "Débito", mark: "▱" },
    { key: "boleto", label: "Boleto", mark: "▤" },
    { key: "transfer", label: "Transferência", mark: "↔" },
  ];
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: settings.businessName,
    description: footer.description,
    telephone: footer.phone || settings.whatsapp,
    email: footer.email,
    address: companyAddress || undefined,
    openingHours: footer.hours || undefined,
    sameAs: activeSocials.map((network) => footer[network.key]),
  };

  if (!dataReady) {
    return <main className="system-loading" role="status"><div><span className="loading-spinner" aria-hidden="true" /><h1>Carregando seus dados</h1><p>Aguarde para acessar o painel.</p></div></main>;
  }

  if (!centralDataLoaded) {
    return <main className="system-loading"><div role="alert"><h1>Não foi possível carregar seus dados</h1><p>Seus cadastros foram preservados. Verifique a conexão e tente novamente para acessar o painel.</p><button className="primary" onClick={() => window.location.reload()}>Tentar novamente</button></div></main>;
  }

  return (
    <main className="app-shell">
      {menuOpen && <button className="sidebar-backdrop" aria-label="Fechar menu" onClick={() => setMenuOpen(false)} />}
      <aside id="main-navigation" aria-label="Navegação do sistema" className={menuOpen ? "sidebar open" : "sidebar"}>
        <button className="sidebar-close" aria-label="Fechar menu" onClick={() => setMenuOpen(false)}>×</button>
        <div className="brand image-logo system-logo">
          <img
            src="/assets/topstampp-logo.png"
            alt="TopStampp Personalizados"
          />
        </div>
        <div className="sidebar-label">PAINEL DE GESTÃO</div>
        <nav aria-label="Menu principal">
          {nav.map((item, i) => item === "Loja Virtual" ? (
            <div className="sidebar-submenu" key={item}>
              <button
                className={activeNav.startsWith("Loja Virtual") ? "active" : ""}
                aria-expanded={storeMenuOpen}
                aria-controls="store-navigation"
                onClick={() => setStoreMenuOpen((open) => !open)}
              >
                <MenuIcon index={i} />
                <span>Loja Virtual</span>
                <b>{storeMenuOpen ? "⌃" : "⌄"}</b>
              </button>
              {storeMenuOpen && (
                <div className="sidebar-submenu-items" id="store-navigation">
                  <button onClick={() => { setActiveNav("Produtos"); setMenuOpen(false); }}>Gerenciar Loja</button>
                  <button onClick={() => { setActiveNav("Loja Virtual"); setMenuOpen(false); }}>Ir para a Loja <small>↗</small></button>
                  <button onClick={() => { setActiveNav("Loja Virtual - Divulgar"); setShareStoreOpen(true); setMenuOpen(false); }}>Divulgar a Loja</button>
                  <button onClick={() => { setActiveNav("Pedidos"); setMenuOpen(false); }}>Pedidos da Loja</button>
                  <button onClick={() => { setActiveNav("Configurações"); setMenuOpen(false); }}>Configurações</button>
                </div>
              )}
            </div>
          ) : (
            <button
              key={item}
              className={item === activeNav ? "active" : ""}
              aria-current={item === activeNav ? "page" : undefined}
              onClick={() => {
                if (
                  [
                    "Visão geral",
                    "Produtos",
                    "Pedidos",
                    "Produção",
                    "Artes",
                    "Pessoas",
                    "Compras",
                    "Financeiro",
                    "Configurações",
                  ].includes(item)
                ) {
                  setActiveNav(item);
                  setMenuOpen(false);
                } else notify(`${item}: módulo disponível na próxima etapa`);
              }}
            >
              <MenuIcon index={i} />
              {item}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer"><div><span>TopStamp</span><small>Personalizados</small></div><span className={`sync-status ${persistenceStatus === "Erro ao salvar" || persistenceStatus === "Base indisponível" ? "sync-error" : ""}`} role="status" aria-live="polite">{persistenceStatus}</span></div>
      </aside>

      {activeNav === "Compras" ? (
        <PurchasesModule
          onMenu={() => setMenuOpen(!menuOpen)}
          people={people}
          setPeople={setPeople}
        />
      ) : activeNav === "Financeiro" ? (
        <section className="workspace finance-page">
          <header className="topbar">
            <button
              className="mobile-menu"
              aria-controls="main-navigation"
              aria-label="Abrir menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>
            <div>
              <p>Gestão financeira • TopStamp</p>
              <h1>Financeiro</h1>
              <span>
                Recebimentos, valores pendentes e comprovantes aguardando
                verificação.
              </span>
            </div>
          </header>
          <section className="metrics finance-metrics">
            <article className="metric cyan">
              <div>$</div>
              <span>
                Total vendido
                <strong className="money">
                  R${" "}
                  {financeTotal.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </strong>
                <small>Pedidos confirmados</small>
              </span>
            </article>
            <article className="metric violet">
              <div>✓</div>
              <span>
                Total recebido
                <strong className="money">
                  R${" "}
                  {financeReceived.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </strong>
                <small>Entradas e pagamentos avulsos</small>
              </span>
            </article>
            <article className="metric amber">
              <div>⌁</div>
              <span>
                A receber
                <strong className="money">
                  R${" "}
                  {Math.max(0, financeTotal - financeReceived).toLocaleString(
                    "pt-BR",
                    { minimumFractionDigits: 2 },
                  )}
                </strong>
                <small>Saldos pendentes</small>
              </span>
            </article>
            <article className="metric red">
              <div>!</div>
              <span>
                Aguardando verificação
                <strong>
                  {
                    financeOrders.filter(
                      (order) =>
                        order.paymentVerification === "Aguardando verificação",
                    ).length
                  }
                </strong>
                <small>Comprovantes enviados</small>
              </span>
            </article>
          </section>
          <section className="finance-panel">
            <header>
              <div>
                <small>CONTAS A RECEBER</small>
                <h2>Movimentações dos pedidos</h2>
              </div>
            </header>
            <div className="finance-table">
              <div className="finance-row finance-head">
                <span>Pedido / cliente</span>
                <span>Valor</span>
                <span>Recebido</span>
                <span>Restante</span>
                <span>Situação</span>
              </div>
              {financeOrders.map((order) => {
                const total = orderTotal(order);
                const paid =
                  order.amountPaid ?? (order.payment === "Pago" ? total : 0);
                return (
                  <button
                    className="finance-row"
                    key={order.id}
                    onClick={() => {
                      setSelectedOrder(order);
                      setOrderModal("details");
                    }}
                  >
                    <span>
                      <b>{order.id}</b>
                      <small>{order.customer}</small>
                    </span>
                    <span>R$ {total.toFixed(2).replace(".", ",")}</span>
                    <span>R$ {paid.toFixed(2).replace(".", ",")}</span>
                    <span>
                      R${" "}
                      {Math.max(0, total - paid)
                        .toFixed(2)
                        .replace(".", ",")}
                    </span>
                    <em
                      className={`finance-status ${order.paymentVerification === "Aguardando verificação" ? "verificacao" : order.payment.toLowerCase()}`}
                    >
                      {order.paymentVerification === "Aguardando verificação"
                        ? "Verificar comprovante"
                        : order.payment}
                    </em>
                  </button>
                );
              })}
            </div>
          </section>
        </section>
      ) : activeNav === "Configurações" ? (
        <section className="workspace settings-page">
          <header className="topbar">
            <button
              className="mobile-menu"
              aria-controls="main-navigation"
              aria-label="Abrir menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>
            <div>
              <p>Administração • TopStamp</p>
              <h1>Configurações</h1>
              <span>
                Personalize os dados da empresa, pagamentos, notificações e
                aparência.
              </span>
            </div>
          </header>
          <section className="settings-grid">
            <article className="settings-card settings-wide">
              <header>
                <i>🏪</i>
                <div>
                  <h2>Dados da empresa</h2>
                  <p>Informações usadas nos pedidos, orçamentos e na loja.</p>
                </div>
              </header>
              <div className="settings-fields">
                <label>
                  Nome da empresa
                  <input
                    value={settings.businessName}
                    onChange={(e) =>
                      setSettings({ ...settings, businessName: e.target.value })
                    }
                  />
                </label>
                <label>
                  WhatsApp
                  <input
                    value={settings.whatsapp}
                    onChange={(e) =>
                      setSettings({ ...settings, whatsapp: e.target.value })
                    }
                  />
                </label>
              </div>
            </article>
            <article className="settings-card">
              <header>
                <i>💳</i>
                <div>
                  <h2>Pagamentos</h2>
                  <p>Dados exibidos ao cliente.</p>
                </div>
              </header>
              <label>
                Chave PIX
                <input
                  placeholder="CPF, CNPJ, e-mail ou chave aleatória"
                  value={settings.pixKey}
                  onChange={(e) =>
                    setSettings({ ...settings, pixKey: e.target.value })
                  }
                />
              </label>
              <label>
                Validade padrão do orçamento (dias)
                <input
                  type="number"
                  min="1"
                  value={settings.quoteValidity}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      quoteValidity: Number(e.target.value),
                    })
                  }
                />
              </label>
            </article>
            <article className="settings-card">
              <header>
                <i>🎨</i>
                <div>
                  <h2>Aparência</h2>
                  <p>Escolha o tema do sistema.</p>
                </div>
              </header>
              <label>
                Tema
                <select
                  value={settings.theme}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      theme: e.target.value as SystemSettings["theme"],
                    })
                  }
                >
                  <option>Automático</option>
                  <option>Claro</option>
                  <option>Escuro</option>
                </select>
              </label>
              <small className="settings-hint">
                No modo automático, o sistema acompanha o horário do
                dispositivo.
              </small>
            </article>
            <article className="settings-card settings-wide">
              <header>
                <i>🔔</i>
                <div>
                  <h2>Notificações</h2>
                  <p>Defina quais alertas devem ficar ativos.</p>
                </div>
              </header>
              <label className="setting-toggle">
                <span>
                  <b>Novos pedidos</b>
                  <small>
                    Avisar quando um pedido chegar pela Loja Virtual.
                  </small>
                </span>
                <input
                  type="checkbox"
                  checked={settings.orderNotifications}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      orderNotifications: e.target.checked,
                    })
                  }
                />
              </label>
              <label className="setting-toggle">
                <span>
                  <b>Estoque baixo</b>
                  <small>
                    Avisar quando um produto atingir o estoque mínimo.
                  </small>
                </span>
                <input
                  type="checkbox"
                  checked={settings.stockNotifications}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      stockNotifications: e.target.checked,
                    })
                  }
                />
              </label>
            </article>
            <article className="settings-card settings-wide data-protection">
              <header>
                <i>🛡️</i>
                <div>
                  <h2>Proteção e preservação dos dados</h2>
                  <p>
                    Atualizações incrementais, cópia de segurança e recuperação
                    administrativa.
                  </p>
                </div>
                <em>{persistenceStatus}</em>
              </header>
              <div className="protection-stats">
                <span>
                  <small>Produtos preservados</small>
                  <b>{products.length}</b>
                </span>
                <span>
                  <small>Clientes preservados</small>
                  <b>{customers.length}</b>
                </span>
                <span>
                  <small>Documentos preservados</small>
                  <b>{orders.length}</b>
                </span>
                <span>
                  <small>Artes preservadas</small>
                  <b>{arts.length}</b>
                </span>
              </div>
              <div className="protection-actions">
                <button onClick={createManualBackup}>
                  ＋ Criar cópia de segurança
                </button>
                <button onClick={restoreBackup}>
                  ↶ Restaurar versão anterior
                </button>
              </div>
              <div className="audit-list">
                <b>Histórico de alterações</b>
                {auditHistory.length ? (
                  auditHistory.slice(0, 6).map((entry) => (
                    <span key={entry.id}>
                      <small>
                        {entry.date} • {entry.user} • {entry.module}
                      </small>
                      {entry.action}
                      <em>{entry.details}</em>
                    </span>
                  ))
                ) : (
                  <p>Nenhuma alteração administrativa registrada ainda.</p>
                )}
              </div>
            </article>
            <article className="settings-card settings-wide footer-settings">
              <header>
                <i>▤</i>
                <div>
                  <h2>Rodapé da Loja</h2>
                  <p>
                    Informações institucionais, contatos, redes sociais e
                    pagamentos.
                  </p>
                </div>
              </header>
              <h3>Identidade e contato</h3>
              <div className="settings-fields triple">
                <label>
                  Slogan
                  <input
                    value={settings.footer.slogan}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        footer: { ...settings.footer, slogan: e.target.value },
                      })
                    }
                  />
                </label>
                <label>
                  Tempo de atuação
                  <input
                    value={settings.footer.years}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        footer: { ...settings.footer, years: e.target.value },
                      })
                    }
                  />
                </label>
                <label>
                  E-mail
                  <input
                    type="email"
                    value={settings.footer.email}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        footer: { ...settings.footer, email: e.target.value },
                      })
                    }
                  />
                </label>
                <label>
                  Telefone
                  <input
                    value={settings.footer.phone}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        footer: { ...settings.footer, phone: e.target.value },
                      })
                    }
                  />
                </label>
                <label>
                  Horário
                  <input
                    value={settings.footer.hours}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        footer: { ...settings.footer, hours: e.target.value },
                      })
                    }
                  />
                </label>
                <label>
                  CEP
                  <input
                    value={settings.footer.cep}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        footer: { ...settings.footer, cep: e.target.value },
                      })
                    }
                  />
                </label>
              </div>
              <label>
                Descrição
                <textarea
                  rows={3}
                  value={settings.footer.description}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      footer: {
                        ...settings.footer,
                        description: e.target.value,
                      },
                    })
                  }
                />
              </label>
              <div className="settings-fields triple">
                <label>
                  Endereço
                  <input
                    value={settings.footer.address}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        footer: { ...settings.footer, address: e.target.value },
                      })
                    }
                  />
                </label>
                <label>
                  Cidade
                  <input
                    value={settings.footer.city}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        footer: { ...settings.footer, city: e.target.value },
                      })
                    }
                  />
                </label>
                <label>
                  Estado
                  <input
                    value={settings.footer.state}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        footer: { ...settings.footer, state: e.target.value },
                      })
                    }
                  />
                </label>
              </div>
              <label>
                Link da localização
                <input
                  value={settings.footer.mapsUrl}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      footer: { ...settings.footer, mapsUrl: e.target.value },
                    })
                  }
                />
              </label>
              <h3>Redes sociais</h3>
              <div className="settings-fields triple">
                {(
                  [
                    "instagram",
                    "facebook",
                    "pinterest",
                    "tiktok",
                    "youtube",
                    "linkedin",
                    "twitter",
                    "threads",
                    "telegram",
                  ] as const
                ).map((network) => (
                  <label key={network}>
                    {network[0].toUpperCase() + network.slice(1)}
                    <input
                      placeholder="Cole o link do perfil"
                      value={settings.footer[network]}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          footer: {
                            ...settings.footer,
                            [network]: e.target.value,
                          },
                        })
                      }
                    />
                  </label>
                ))}
              </div>
              <h3>Formas de pagamento</h3>
              <div className="payment-toggles">
                {(
                  [
                    ["pix", "PIX"],
                    ["credit", "Crédito"],
                    ["debit", "Débito"],
                    ["boleto", "Boleto"],
                    ["transfer", "Transferência"],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key}>
                    <input
                      type="checkbox"
                      checked={settings.footer.payments[key]}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          footer: {
                            ...settings.footer,
                            payments: {
                              ...settings.footer.payments,
                              [key]: e.target.checked,
                            },
                          },
                        })
                      }
                    />
                    {label}
                  </label>
                ))}
              </div>
            </article>
          </section>
          <div className="settings-save">
            <span>
              {persistenceStatus === "Salvo com sucesso" ? "✓ Dados sincronizados em computador, celular e tablet." : persistenceStatus}
            </span>
            <button
              className="primary"
              onClick={() => {
                registerAudit(
                  "Configurações salvas",
                  "Configurações",
                  "Somente campos modificados foram atualizados",
                );
                notify("Configurações salvas sem alterar os demais dados.");
              }}
            >
              Salvar configurações
            </button>
          </div>
        </section>
      ) : activeNav === "Visão geral" ? (
        <section className="workspace overview-page">
          <header className="topbar overview-header">
            <button
              className="mobile-menu"
              aria-controls="main-navigation"
              aria-label="Abrir menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>
            <div>
              <p>Painel principal • TopStamp</p>
              <h1>Visão geral</h1>
              <span>
                Acompanhe vendas, produção, estoque e clientes em um só lugar.
              </span>
            </div>
            <button
              className="primary"
              onClick={() => {
                setActiveNav("Pedidos");
                setOrderModal("new");
              }}
            >
              <b>＋</b> Novo pedido
            </button>
          </header>
          <section className="overview-welcome">
            <div>
              <small>RESUMO DO NEGÓCIO</small>
              <h2>Olá! Sua operação está em movimento.</h2>
              <p>
                Veja o que precisa de atenção e acesse rapidamente os módulos do
                sistema.
              </p>
            </div>
            <span>✦</span>
          </section>
          <section
            className="metrics overview-metrics"
            aria-label="Indicadores gerais"
          >
            <article className="metric cyan">
              <div>▢</div>
              <span>
                Pedidos ativos
                <strong>
                  {orders.filter((order) => order.status !== "Pronto").length}
                </strong>
                <small>
                  {
                    orders.filter(
                      (order) => order.status === "Aguardando confirmação",
                    ).length
                  }{" "}
                  aguardando confirmação
                </small>
              </span>
            </article>
            <article className="metric amber">
              <div>!</div>
              <span>
                Estoque baixo
                <strong>
                  {
                    products.filter(
                      (product) => product.stock <= product.minStock,
                    ).length
                  }
                </strong>
                <small>Produtos que exigem atenção</small>
              </span>
            </article>
            <article className="metric violet">
              <div>✦</div>
              <span>
                Artes disponíveis
                <strong>{arts.filter((art) => art.active).length}</strong>
                <small>Catálogo protegido ativo</small>
              </span>
            </article>
            <article className="metric red">
              <div>$</div>
              <span>
                Total em pedidos
                <strong className="money">
                  R${" "}
                  {orders
                    .reduce((sum, order) => sum + orderTotal(order), 0)
                    .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </strong>
                <small>{customers.length} clientes cadastrados</small>
              </span>
            </article>
          </section>
          <section className="overview-columns">
            <article className="overview-panel">
              <header>
                <div>
                  <small>ACOMPANHAMENTO</small>
                  <h2>Pedidos recentes</h2>
                </div>
                <button onClick={() => setActiveNav("Pedidos")}>
                  Ver todos →
                </button>
              </header>
              <div className="overview-list">
                {orders.slice(0, 4).map((order) => (
                  <button
                    key={order.id}
                    onClick={() => {
                      setSelectedOrder(order);
                      setOrderModal("details");
                      setActiveNav("Pedidos");
                    }}
                  >
                    <span>
                      <b>
                        {order.id} • {order.customer}
                      </b>
                      <small>
                        {order.items.reduce(
                          (sum, item) => sum + item.quantity,
                          0,
                        )}{" "}
                        itens • R${" "}
                        {orderTotal(order).toFixed(2).replace(".", ",")}
                      </small>
                    </span>
                    <em
                      className={`status-pill ${order.status.toLowerCase().replace(" ", "-")}`}
                    >
                      {order.status}
                    </em>
                  </button>
                ))}
              </div>
            </article>
            <article className="overview-panel">
              <header>
                <div>
                  <small>ATALHOS</small>
                  <h2>Acesso rápido</h2>
                </div>
              </header>
              <div className="quick-grid">
                <button onClick={() => setActiveNav("Produtos")}>
                  <i>◇</i>
                  <b>Produtos</b>
                  <small>Gerenciar catálogo</small>
                </button>
                <button onClick={() => setActiveNav("Loja Virtual")}>
                  <i>🛍</i>
                  <b>Loja Virtual</b>
                  <small>Abrir vitrine</small>
                </button>
                <button onClick={() => setActiveNav("Artes")}>
                  <i>✦</i>
                  <b>Artes</b>
                  <small>Biblioteca protegida</small>
                </button>
                <button
                  onClick={() => {
                    setActiveNav("Pessoas");
                    setPeopleTab("Cliente");
                  }}
                >
                  <i>♙</i>
                  <b>Pessoas</b>
                  <small>Ver cadastros</small>
                </button>
              </div>
            </article>
          </section>
          <section className="stock-alert">
            <div>
              <span>!</span>
              <p>
                <b>
                  {
                    products.filter(
                      (product) => product.stock <= product.minStock,
                    ).length
                  }{" "}
                  produtos com estoque baixo
                </b>
                <small>
                  Revise as quantidades para evitar atrasos nos próximos
                  pedidos.
                </small>
              </p>
            </div>
            <button
              onClick={() => {
                setFilter("Estoque baixo");
                setActiveNav("Produtos");
              }}
            >
              Ver estoque →
            </button>
          </section>
        </section>
      ) : activeNav === "Produtos" ? (
        <section className="workspace">
          <header className="topbar">
            <button
              className="mobile-menu"
              aria-controls="main-navigation"
              aria-label="Abrir menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>
            <div>
              <p>Catálogo • TopStamp</p>
              <h1>Produtos personalizados</h1>
              <span>
                Organize seu catálogo e acompanhe a produção em um só lugar.
              </span>
            </div>
            <button className="primary" onClick={() => openModal("new")}>
              <b>＋</b> Novo produto
            </button>
          </header>

          <div className="toolbar">
            <label className="search">
              <span>⌕</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nome, código ou categoria"
                aria-label="Buscar produtos"
              />
            </label>
            <button
              className="compact"
              onClick={() => notify("Relatório atualizado")}
            >
              ↗ Exportar
            </button>
          </div>

          <section className="metrics" aria-label="Resumo do catálogo">
            <article className="metric cyan">
              <div>◇</div>
              <span>
                Produtos ativos<strong>128</strong>
                <small>↑ 8 este mês</small>
              </span>
            </article>
            <article className="metric amber">
              <div>!</div>
              <span>
                Estoque baixo<strong>9</strong>
                <small>Exige atenção</small>
              </span>
            </article>
            <article className="metric violet">
              <div>✎</div>
              <span>
                Artes pendentes<strong>14</strong>
                <small>4 aguardando cliente</small>
              </span>
            </article>
            <article className="metric red">
              <div>⚙</div>
              <span>
                Em produção<strong>23</strong>
                <small>7 finalizam hoje</small>
              </span>
            </article>
          </section>

          <section className="catalog-head">
            <div>
              <h2>Catálogo de produtos</h2>
              <p>{filtered.length} produtos encontrados</p>
            </div>
            <div className="filters">
              {["Todos", "Ativos", "Estoque baixo"].map((item) => (
                <button
                  key={item}
                  className={filter === item ? "selected" : ""}
                  onClick={() => setFilter(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </section>

          <section className="product-grid">
            {filtered.map((p) => (
              <article className="product-card" key={p.id}>
                <div
                  className={`product-image ${p.gradient}`}
                  onDoubleClick={() => openModal("details", p)}
                >
                  {p.images[0] ? (
                    <img src={p.images[0]} alt={p.name} />
                  ) : (
                    <span>{p.emoji}</span>
                  )}
                  <em>{p.category}</em>
                  {p.images.length > 1 && (
                    <small className="photo-count">▣ {p.images.length}</small>
                  )}
                  <button
                    aria-label={`Favoritar ${p.name}`}
                    onClick={() => notify(`${p.name} adicionado aos favoritos`)}
                  >
                    ♡
                  </button>
                </div>
                <div className="product-info">
                  <div className="product-title">
                    <div>
                      <h3>{p.name}</h3>
                      <p>
                        CÓD: {p.code} • {p.variations.length} variações
                      </p>
                    </div>
                    <button
                      aria-label={`Mais opções para ${p.name}`}
                      onClick={() =>
                        setActionsFor(actionsFor === p.id ? null : p.id)
                      }
                    >
                      ⋮
                    </button>
                    {actionsFor === p.id && (
                      <div className="action-menu">
                        <button onClick={() => openModal("details", p)}>
                          ◉ Ver detalhes
                        </button>
                        <button onClick={() => openModal("edit", p)}>
                          ✎ Editar
                        </button>
                        <button onClick={() => openModal("stock", p)}>
                          ↕ Ajustar estoque
                        </button>
                        <button onClick={() => duplicateProduct(p)}>
                          ▣ Duplicar
                        </button>
                        <button
                          className="danger"
                          onClick={() => deleteProduct(p)}
                        >
                          ⌫ Excluir
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="stock">
                    <span>▣</span>
                    <div>
                      <b>{p.stock} unidades</b>
                      <small>Estoque mínimo: {p.minStock}</small>
                    </div>
                    <strong>
                      Varejo
                      <br />
                      R$ {p.retailPrice.toFixed(2).replace(".", ",")}
                    </strong>
                  </div>
                  <div className="price-strip">
                    <span>
                      <small>ATACADO</small>R${" "}
                      {p.wholesalePrice.toFixed(2).replace(".", ",")}
                    </span>
                    <em>A partir de {p.wholesaleMin} un.</em>
                  </div>
                  <div className="variant-preview">
                    {p.variations.slice(0, 2).map((v) => (
                      <span key={v}>{v}</span>
                    ))}
                    {p.variations.length > 2 && (
                      <span>+{p.variations.length - 2}</span>
                    )}
                  </div>
                  <div className="tags">
                    <span className="active-tag">Ativo</span>
                    {p.stock <= p.minStock && (
                      <span className="low-tag">Estoque baixo</span>
                    )}
                    <span className="art-tag">{p.art}</span>
                  </div>
                </div>
              </article>
            ))}
            {filtered.length === 0 && (
              <div className="empty">
                <span>⌕</span>
                <h3>Nenhum produto encontrado</h3>
                <p>Tente outra busca ou limpe os filtros.</p>
                <button
                  onClick={() => {
                    setQuery("");
                    setFilter("Todos");
                  }}
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </section>
        </section>
      ) : activeNav === "Loja Virtual" || activeNav === "Loja Virtual - Divulgar" ? (
        <section className="storefront">
          {activeNav === "Loja Virtual - Divulgar" && (
          <section className="store-share-admin">
            <header>
              <div>
                <small>PAINEL ADMINISTRATIVO • ACESSO RESTRITO</small>
                <h2>Compartilhar Loja</h2>
                <p>
                  Gere, copie e envie o link estável da Loja Virtual. Esta área
                  nunca aparece para o cliente.
                </p>
              </div>
              <button
                className="primary"
                onClick={() => setShareStoreOpen(!shareStoreOpen)}
              >
                ◉ Enviar link da loja
              </button>
            </header>
            <div className="store-share-actions">
              <button onClick={copyStoreLink}>⧉ Copiar link</button>
              <button
                onClick={() =>
                  window.open(publicStoreLink, "_blank", "noopener,noreferrer")
                }
              >
                ↗ Visualizar como cliente
              </button>
              <button
                onClick={() => notify("QR Code seguro gerado para este link.")}
              >
                ▦ Gerar QR Code
              </button>
              <button onClick={nativeShareStore}>⌁ Compartilhar</button>
              <button onClick={() => setShareStoreOpen(true)}>
                ＋ Criar link personalizado
              </button>
              <button
                onClick={() =>
                  notify("Selecione um link no histórico para desativá-lo.")
                }
              >
                ⊘ Desativar link
              </button>
            </div>
            {shareStoreOpen && (
              <div className="store-share-form">
                <label>
                  Cliente
                  <select
                    value={shareCustomerId}
                    onChange={(e) => selectShareCustomer(e.target.value)}
                  >
                    <option value="">Contato avulso</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Nome do contato
                  <input
                    value={shareName}
                    onChange={(e) => setShareName(e.target.value)}
                    placeholder="Nome do cliente"
                  />
                </label>
                <label>
                  Número do WhatsApp
                  <input
                    value={sharePhone}
                    onChange={(e) => setSharePhone(e.target.value)}
                    placeholder="(62) 99999-9999"
                  />
                </label>
                <label>
                  Campanha ou origem
                  <select
                    value={shareCampaign}
                    onChange={(e) => setShareCampaign(e.target.value)}
                  >
                    <option>WhatsApp</option>
                    <option>Instagram</option>
                    <option>Facebook</option>
                    <option>Pinterest</option>
                    <option>Promoção</option>
                    <option>Evento</option>
                    <option>Vendedor</option>
                  </select>
                </label>
                <label>
                  Validade do link
                  <input
                    type="date"
                    value={shareValidity}
                    onChange={(e) => setShareValidity(e.target.value)}
                  />
                </label>
                <label>
                  Responsável
                  <input value="Administrador" readOnly />
                </label>
                <label className="share-wide">
                  Mensagem personalizada
                  <textarea
                    rows={3}
                    value={shareMessage}
                    onChange={(e) => setShareMessage(e.target.value)}
                  />
                  <small>
                    Use as variáveis {"{NOME}"} e {"{LINK}"}.
                  </small>
                </label>
                <label className="share-wide">
                  Link da loja
                  <input value={personalizedStoreLink()} readOnly />
                </label>
                <label className="share-wide">
                  Observações
                  <textarea
                    rows={2}
                    placeholder="Informações internas sobre o envio"
                  />
                </label>
                <div className="share-templates">
                  <button
                    onClick={() =>
                      setShareMessage(
                        "Olá! Acesse nossa Loja Virtual e confira nossos produtos personalizados: {LINK}",
                      )
                    }
                  >
                    Mensagem geral
                  </button>
                  <button
                    onClick={() =>
                      setShareMessage(
                        "Olá, {NOME}! Temos novidades e ofertas especiais em nossa Loja Virtual. Acesse: {LINK}",
                      )
                    }
                  >
                    Promocional
                  </button>
                  <button
                    onClick={() =>
                      setShareMessage(
                        "Olá, {NOME}! Pelo link abaixo você poderá escolher os produtos e solicitar seu orçamento: {LINK}",
                      )
                    }
                  >
                    Orçamento
                  </button>
                  <button
                    onClick={() =>
                      setShareMessage(
                        "Olá, {NOME}! Preparamos uma forma mais rápida de fazer seus pedidos. Acesse nossa Loja Virtual: {LINK}",
                      )
                    }
                  >
                    Cliente recorrente
                  </button>
                </div>
                <button className="share-send" onClick={sendStoreLink}>
                  ◉ Abrir WhatsApp com mensagem pronta
                </button>
              </div>
            )}
            <div className="store-link-history">
              <div>
                <b>Histórico de Links</b>
                <span>
                  {storeLinks.length} registro(s) • origem, acessos e vendas
                  rastreados
                </span>
              </div>
              {storeLinks.length ? (
                <div className="link-history-table">
                  <small>CLIENTE</small>
                  <small>ORIGEM</small>
                  <small>DATA E HORA</small>
                  <small>STATUS</small>
                  <small>ACESSOS</small>
                  {storeLinks.slice(0, 5).map((item) => (
                    <div className="link-history-row" key={item.id}>
                      <b>
                        {item.customer}
                        <em>{item.phone}</em>
                      </b>
                      <span>{item.campaign}</span>
                      <span>{item.sentAt}</span>
                      <i>{item.status}</i>
                      <strong>{item.accesses}</strong>
                    </div>
                  ))}
                </div>
              ) : (
                <p>
                  Nenhum link enviado ainda. O primeiro envio aparecerá aqui
                  automaticamente.
                </p>
              )}
            </div>
          </section>
          )}
          {activeNav === "Loja Virtual" && (<>
          <header className="store-nav">
            <button
              className="mobile-menu"
              aria-controls="main-navigation"
              aria-label="Abrir menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>
            <div className="store-logo image-logo">
              <img
                src="/assets/topstampp-logo.png"
                alt="TopStampp Personalizados"
              />
            </div>
            <nav>
              <a href="#novidades">Novidades</a>
              <a href="#catalogo">Produtos</a>
              <a href="#como-funciona">Como funciona</a>
            </nav>
            <button className="cart-button" onClick={() => setCartOpen(true)}>
              🛍 Minha seleção <b>{cartCount}</b>
            </button>
          </header>
          <section className="store-hero" id="novidades">
            <div className="hero-copy">
              <em>✦ PERSONALIZADO DO SEU JEITO</em>
              <div className="welcome-offer">
                PRIMEIRA COMPRA <b>10% OFF</b>
              </div>
              <h1>
                Ideias que viram
                <br />
                <span>momentos únicos.</span>
              </h1>
              <p>
                Escolha seus produtos, personalize cada detalhe e receba um
                orçamento rápido. Produção com carinho em Goiânia e envio para
                todo o Brasil.
              </p>
              <div>
                <button
                  onClick={() =>
                    document
                      .getElementById("catalogo")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Explorar produtos →
                </button>
                <a href="https://wa.me/5562920004609" target="_blank">
                  ◉ Falar no WhatsApp
                </a>
              </div>
              <small>
                ✓ Arte personalizada &nbsp; ✓ Atacado e varejo &nbsp; ✓
                Atendimento humano
              </small>
            </div>
            <div className="hero-showcase">
              <div className="showcase-main">
                <span>☕</span>
                <b>Feito para surpreender</b>
                <small>Canecas, camisetas e muito mais</small>
              </div>
              <i className="spark one">✦</i>
              <i className="spark two">●</i>
              <i className="spark three">✦</i>
              <div className="floating-card">
                <span>★ 4,9</span>
                <small>clientes encantados</small>
              </div>
            </div>
          </section>
          <section className="store-benefits">
            <div>
              <b>✦</b>
              <span>
                <strong>Criação exclusiva</strong>
                <small>Uma arte feita para você</small>
              </span>
            </div>
            <div>
              <b>⚡</b>
              <span>
                <strong>Orçamento rápido</strong>
                <small>Direto pelo WhatsApp</small>
              </span>
            </div>
            <div>
              <b>♡</b>
              <span>
                <strong>Feito com carinho</strong>
                <small>Qualidade em cada detalhe</small>
              </span>
            </div>
            <div>
              <b>▣</b>
              <span>
                <strong>Compra segura</strong>
                <small>Acompanhamento do pedido</small>
              </span>
            </div>
          </section>
          <section className="store-catalog" id="catalogo">
            <div className="store-section-head">
              <div>
                <em>NOSSA COLEÇÃO</em>
                <h2>Encontre o presente perfeito</h2>
                <p>
                  Clique no produto para ver todas as informações e
                  personalizar.
                </p>
              </div>
              <label>
                <span>⌕</span>
                <input
                  value={storeQuery}
                  onChange={(e) => setStoreQuery(e.target.value)}
                  placeholder="O que você procura?"
                />
              </label>
            </div>
            <div className="store-categories">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={storeCategory === cat ? "active" : ""}
                  onClick={() => setStoreCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="store-grid">
              {storeProducts.map((p) => (
                <article
                  key={p.id}
                  className="clickable-product"
                  onClick={() => openStoreProduct(p)}
                >
                  <div className={`store-product-image ${p.gradient}`}>
                    {p.images[0] ? (
                      <img src={p.images[0]} alt={p.name} />
                    ) : (
                      <span>{p.emoji}</span>
                    )}
                    <em>{p.category}</em>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        notify("Adicionado aos favoritos");
                      }}
                    >
                      ♡
                    </button>
                  </div>
                  <div className="store-product-info">
                    <small>
                      {p.code} • {p.variations.length} opções
                    </small>
                    <h3>{p.name}</h3>
                    <p>
                      Personalize cores, arte e detalhes para deixar com a sua
                      cara.
                    </p>
                    <div className="store-price">
                      <span>
                        <small>A partir de</small>
                        <strong>
                          R$ {p.retailPrice.toFixed(2).replace(".", ",")}
                        </strong>
                      </span>
                      {p.wholesaleMin > 1 && (
                        <em>
                          Atacado R${" "}
                          {p.wholesalePrice.toFixed(2).replace(".", ",")}
                        </em>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(p);
                      }}
                    >
                      ＋ Adicionar ao orçamento
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
          <section className="how-it-works" id="como-funciona">
            <em>SIMPLES E RÁPIDO</em>
            <h2>Do seu jeito, em 4 passos</h2>
            <div>
              <article>
                <b>01</b>
                <span>Escolha</span>
                <p>Navegue e selecione seus produtos favoritos.</p>
              </article>
              <article>
                <b>02</b>
                <span>Personalize</span>
                <p>Conte sua ideia, envie a arte ou peça nossa ajuda.</p>
              </article>
              <article>
                <b>03</b>
                <span>Aprove</span>
                <p>Você recebe a prévia antes da produção.</p>
              </article>
              <article>
                <b>04</b>
                <span>Receba</span>
                <p>Acompanhe o pedido até a entrega.</p>
              </article>
            </div>
          </section>
          <section className="store-cta">
            <div>
              <em>VAMOS CRIAR JUNTOS?</em>
              <h2>Seu próximo presente inesquecível começa aqui.</h2>
              <p>
                Monte sua seleção e fale com nossa equipe. Respondemos
                rapidinho.
              </p>
            </div>
            <button
              onClick={() =>
                window.open("https://wa.me/5562920004609", "_blank")
              }
            >
              ◉ Chamar no WhatsApp
            </button>
          </section>
          <footer className="professional-footer">
            <div className="footer-main">
              <section className="footer-brand">
                <div className="store-logo image-logo footer-image-logo">
                  <img
                    src="/assets/topstampp-logo.png"
                    alt={settings.businessName}
                  />
                </div>
                <h2>{settings.businessName}</h2>
                {settings.footer.slogan && <em>“{settings.footer.slogan}”</em>}
                {settings.footer.description && (
                  <p>{settings.footer.description}</p>
                )}
                {settings.footer.years && <b>{settings.footer.years}</b>}
                <div className="security-badges">
                  <span>✓ Compra segura</span>
                  <span>🔒 Site protegido</span>
                  <span>LGPD</span>
                  <span>SSL</span>
                </div>
              </section>
              <section>
                <h3>Atendimento</h3>
                {settings.footer.phone && (
                  <a href={`tel:${settings.footer.phone.replace(/\D/g, "")}`}>
                    ☎ {settings.footer.phone}
                  </a>
                )}
                {settings.whatsapp && (
                  <a
                    href={`https://wa.me/55${settings.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    ◉ WhatsApp
                  </a>
                )}
                {settings.footer.email && (
                  <a href={`mailto:${settings.footer.email}`}>
                    ✉ {settings.footer.email}
                  </a>
                )}
                {settings.footer.hours && <p>◷ {settings.footer.hours}</p>}
                {(settings.footer.address || settings.footer.city) && (
                  <p>
                    ⌖{" "}
                    {[
                      settings.footer.address,
                      settings.footer.city,
                      settings.footer.state,
                      settings.footer.cep,
                    ]
                      .filter(Boolean)
                      .join(" • ")}
                  </p>
                )}
                {settings.footer.mapsUrl && (
                  <a
                    className="footer-action"
                    href={settings.footer.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Como chegar →
                  </a>
                )}
                <div className="social-grid">
                  {(
                    [
                      ["instagram", "◎"],
                      ["facebook", "f"],
                      ["pinterest", "p"],
                      ["tiktok", "♪"],
                      ["youtube", "▶"],
                      ["linkedin", "in"],
                      ["twitter", "𝕏"],
                      ["threads", "@"],
                      ["telegram", "➤"],
                    ] as const
                  ).map(([network, icon]) =>
                    settings.footer[network] ? (
                      <a
                        key={network}
                        href={settings.footer[network]}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={network}
                      >
                        {icon}
                      </a>
                    ) : null,
                  )}
                </div>
              </section>
              <section>
                <h3>Links rápidos</h3>
                <a href="#catalogo">Solicitar orçamento</a>
                <button
                  onClick={() => {
                    setActiveNav("Pedidos");
                    setOrderView("Pedido");
                  }}
                >
                  Acompanhar pedido
                </button>
                <a
                  href={`https://wa.me/55${settings.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Fale conosco
                </a>
                <button
                  onClick={() =>
                    notify(
                      "Central de Ajuda: fale com nossa equipe pelo WhatsApp.",
                    )
                  }
                >
                  Central de ajuda
                </button>
                <button
                  onClick={() =>
                    notify(
                      "FAQ: escolha o produto, personalize, aprove a arte e acompanhe a produção.",
                    )
                  }
                >
                  Perguntas frequentes
                </button>
                <button
                  onClick={() =>
                    notify(
                      "Política de trocas disponível com nosso atendimento.",
                    )
                  }
                >
                  Política de trocas
                </button>
                <button
                  onClick={() =>
                    notify("Seus dados são tratados conforme a LGPD.")
                  }
                >
                  Política de privacidade
                </button>
                <button
                  onClick={() =>
                    notify("Termos de uso da Loja Virtual TopStamp.")
                  }
                >
                  Termos de uso
                </button>
              </section>
              <section>
                <h3>Categorias</h3>
                {categories
                  .filter((c) => c !== "Todos")
                  .slice(0, 8)
                  .map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setStoreCategory(category);
                        document
                          .getElementById("catalogo")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      {category}
                    </button>
                  ))}
                <h3 className="payments-title">Formas de pagamento</h3>
                <div className="footer-payments">
                  {settings.footer.payments.pix && <span>PIX</span>}
                  {settings.footer.payments.credit && <span>Crédito</span>}
                  {settings.footer.payments.debit && <span>Débito</span>}
                  {settings.footer.payments.boleto && <span>Boleto</span>}
                  {settings.footer.payments.transfer && (
                    <span>Transferência</span>
                  )}
                </div>
              </section>
              {settings.footer.newsletter && (
                <section className="footer-newsletter">
                  <h3>Receba nossas novidades</h3>
                  <p>Novos produtos, artes e promoções direto no seu e-mail.</p>
                  <form onSubmit={subscribeNewsletter}>
                    <input
                      placeholder="Seu nome"
                      value={newsletterName}
                      onChange={(e) => setNewsletterName(e.target.value)}
                    />
                    <input
                      type="email"
                      placeholder="Seu melhor e-mail"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                    />
                    <button>Cadastrar</button>
                  </form>
                  <small>
                    Ao cadastrar, você concorda em receber comunicações da
                    TopStamp.
                  </small>
                </section>
              )}
            </div>
            <div className="footer-bottom">
              <span>
                © {new Date().getFullYear()} {settings.businessName}. Todos os
                direitos reservados.
              </span>
              {settings.footer.developerName && (
                <span>
                  Desenvolvido por{" "}
                  {settings.footer.developerUrl ? (
                    <a
                      href={settings.footer.developerUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {settings.footer.developerName}
                    </a>
                  ) : (
                    settings.footer.developerName
                  )}
                </span>
              )}
            </div>
          </footer>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                name: settings.businessName,
                telephone: settings.footer.phone || settings.whatsapp,
                email: settings.footer.email,
                address: {
                  "@type": "PostalAddress",
                  streetAddress: settings.footer.address,
                  addressLocality: settings.footer.city,
                  addressRegion: settings.footer.state,
                  postalCode: settings.footer.cep,
                },
                openingHours: settings.footer.hours,
                sameAs: (
                  [
                    "instagram",
                    "facebook",
                    "pinterest",
                    "tiktok",
                    "youtube",
                    "linkedin",
                    "twitter",
                    "threads",
                    "telegram",
                  ] as const
                )
                  .map((key) => settings.footer[key])
                  .filter(Boolean),
              }),
            }}
          />
          </>)}
        </section>
      ) : activeNav === "Produção" ? (
        <section className="workspace production-page">
          <header className="topbar">
            <button
              className="mobile-menu"
              aria-controls="main-navigation"
              aria-label="Abrir menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>
            <div>
              <p>Operação • TopStamp</p>
              <h1>Produção</h1>
              <span>
                Acompanhe os pedidos por etapa e avance o trabalho até ficar
                pronto.
              </span>
            </div>
          </header>
          <section className="metrics order-metrics">
            <article className="metric violet">
              <div>✦</div>
              <span>
                Arte pendente
                <strong>
                  {orders.filter((o) => o.status === "Arte pendente").length}
                </strong>
                <small>Aguardando aprovação</small>
              </span>
            </article>
            <article className="metric cyan">
              <div>▢</div>
              <span>
                Fila de entrada
                <strong>
                  {
                    orders.filter((o) =>
                      ["Novo", "Aguardando confirmação"].includes(o.status),
                    ).length
                  }
                </strong>
                <small>Pedidos para iniciar</small>
              </span>
            </article>
            <article className="metric amber">
              <div>⌁</div>
              <span>
                Em produção
                <strong>
                  {orders.filter((o) => o.status === "Em produção").length}
                </strong>
                <small>Trabalhos em andamento</small>
              </span>
            </article>
            <article className="metric red">
              <div>✓</div>
              <span>
                Prontos
                <strong>
                  {orders.filter((o) => o.status === "Pronto").length}
                </strong>
                <small>Aguardando entrega</small>
              </span>
            </article>
          </section>
          <div className="production-filters">
            <label>
              Filtrar produção
              <select
                value={productionFilter}
                onChange={(e) => setProductionFilter(e.target.value)}
              >
                <option>Todos</option>
                <option>Arte pendente</option>
                <option>Em produção</option>
                <option>Pronto</option>
                <option>Prioridade alta</option>
                <option>Pagamento pendente</option>
              </select>
            </label>
            <button
              onClick={() =>
                notify(
                  "Filtros avançados: data, responsável, cliente, produto, categoria e atrasos.",
                )
              }
            >
              ⚙ Filtros avançados
            </button>
          </div>
          <section className="production-board">
            {[
              {
                title: "Fila de entrada",
                statuses: ["Novo", "Aguardando confirmação"],
              },
              { title: "Arte pendente", statuses: ["Arte pendente"] },
              { title: "Em produção", statuses: ["Em produção"] },
              { title: "Pronto", statuses: ["Pronto"] },
            ].map((column) => (
              <article className="production-column" key={column.title}>
                <header>
                  <h2>{column.title}</h2>
                  <b>
                    {
                      orders.filter((o) => column.statuses.includes(o.status))
                        .length
                    }
                  </b>
                </header>
                <div>
                  {orders
                    .filter((o) => column.statuses.includes(o.status))
                    .map((order) => (
                      <section
                        className="production-card clickable"
                        key={order.id}
                        onClick={() => setProductionOrder(order)}
                      >
                        <small>
                          {order.id} • ENTREGA {order.delivery}
                        </small>
                        <h3>{order.customer}</h3>
                        <p>
                          {order.items
                            .map((item) => `${item.quantity}× ${item.name}`)
                            .join(" • ")}
                        </p>
                        <span>
                          {order.items.reduce(
                            (sum, item) => sum + item.quantity,
                            0,
                          )}{" "}
                          unidades
                        </span>
                        <div>
                          {order.status !== "Arte pendente" &&
                            order.status !== "Em produção" &&
                            order.status !== "Pronto" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveProduction(order, "Arte pendente");
                                }}
                              >
                                Enviar para arte
                              </button>
                            )}
                          {order.status === "Arte pendente" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                moveProduction(order, "Em produção");
                              }}
                            >
                              Arte aprovada → produzir
                            </button>
                          )}
                          {order.status === "Em produção" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                moveProduction(order, "Pronto");
                              }}
                            >
                              Marcar como pronto
                            </button>
                          )}
                          {order.status === "Pronto" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOrder(order);
                                setOrderModal("details");
                              }}
                            >
                              Ver pedido
                            </button>
                          )}
                        </div>
                      </section>
                    ))}
                  {!orders.some((o) => column.statuses.includes(o.status)) && (
                    <p className="production-empty">
                      Nenhum pedido nesta etapa.
                    </p>
                  )}
                </div>
              </article>
            ))}
          </section>
        </section>
      ) : activeNav === "Artes" ? (
        <section className="workspace module-page">
          <header className="topbar">
            <button
              className="mobile-menu"
              aria-controls="main-navigation"
              aria-label="Abrir menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>
            <div>
              <p>Catálogo inteligente • TopStamp</p>
              <h1>Catálogo de Artes</h1>
              <span>
                Escolha, personalize e visualize artes compatíveis com cada
                produto.
              </span>
            </div>
            <button className="primary" onClick={() => setArtModal("new")}>
              ＋ Cadastrar arte
            </button>
          </header>
          <article style={{ background: "#fff", border: "1px solid #f4b332", borderRadius: 18, padding: 24, marginBottom: 24 }}>
            <h2 style={{ marginTop: 0 }}>Embalagem de canecas • TopStamp</h2>
            <p>Arte em amarelo e laranja, com a marca e o Instagram nas duas faces.</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/embalagem-canecas-topstamp.png" alt="Arte TopStamp para embalagem de canecas, com duas faces e abas, nas cores amarelo e laranja" style={{ display: "block", width: "100%", maxWidth: 680, height: "auto", margin: "20px auto" }} />
            <p style={{ fontSize: 14 }}>Prévia baseada na proporção da foto. Confirme as medidas e o encaixe das abas antes de imprimir ou recortar.</p>
            <a className="primary" href="/assets/embalagem-canecas-topstamp.png" download="Embalagem_Canecas_TopStamp.png">Baixar arte PNG</a>
          </article>
          <div className="art-product-context">
            <div className="art-product-icon">☕</div>
            <span>
              <small>PRODUTO SELECIONADO</small>
              <b>
                {artProduct === "Todos os produtos"
                  ? "Explore todo o catálogo"
                  : artProduct}
              </b>
              <em>
                {artProduct === "Canecas"
                  ? "Caneca Cerâmica • 325 ml • Área 222 × 96 mm"
                  : "A compatibilidade é validada automaticamente"}
              </em>
            </span>
            <strong>✓ Artes compatíveis</strong>
          </div>
          <div className="art-security">
            ✨{" "}
            <span>
              <b>Prévia inteligente e arquivos protegidos</b>
              <small>
                A IA simula a arte no produto sem alterar o arquivo original. A
                prévia respeita a área segura e fica vinculada ao pedido após a
                aprovação.
              </small>
            </span>
          </div>
          <div className="art-toolbar">
            <label className="search">
              <span>⌕</span>
              <input
                value={artQuery}
                onChange={(e) => setArtQuery(e.target.value)}
                placeholder="Buscar por nome, código, tema, tag ou frase..."
              />
            </label>
            <select
              value={artProduct}
              onChange={(e) => setArtProduct(e.target.value)}
            >
              <option>Todos os produtos</option>
              {Array.from(new Set(products.map((p) => p.category))).map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <select
              value={artTheme}
              onChange={(e) => setArtTheme(e.target.value)}
            >
              <option>Todos os temas</option>
              {Array.from(new Set(arts.map((a) => a.theme || a.category))).map(
                (t) => (
                  <option key={t}>{t}</option>
                ),
              )}
            </select>
          </div>
          <div className="art-categories">
            {["Todas", ...Array.from(new Set(arts.map((a) => a.category)))].map(
              (category) => (
                <button
                  className={artCategory === category ? "active" : ""}
                  key={category}
                  onClick={() => setArtCategory(category)}
                >
                  {category}
                </button>
              ),
            )}
          </div>
          <section className="art-grid">
            {arts
              .filter(
                (a) =>
                  a.active &&
                  (artCategory === "Todas" || a.category === artCategory) &&
                  (artProduct === "Todos os produtos" ||
                    (a.compatibleCategories || []).includes(artProduct)) &&
                  (artTheme === "Todos os temas" ||
                    (a.theme || a.category) === artTheme) &&
                  `${a.name} ${a.code} ${a.category} ${a.theme || ""} ${a.style || ""}`
                    .toLowerCase()
                    .includes(artQuery.toLowerCase()),
              )
              .map((art) => (
                <article key={art.id}>
                  <div className={`art-preview ${art.gradient}`}>
                    <button
                      className={`art-favorite ${favoriteArts.includes(art.id) ? "active" : ""}`}
                      onClick={() =>
                        setFavoriteArts((current) =>
                          current.includes(art.id)
                            ? current.filter((id) => id !== art.id)
                            : [...current, art.id],
                        )
                      }
                    >
                      ♥
                    </button>
                    <div className="art-badges">
                      {art.new && <b>NOVIDADE</b>}
                      {art.featured && <b>DESTAQUE</b>}
                    </div>
                    <span>{art.emoji}</span>
                    <i>PRÉVIA PROTEGIDA</i>
                    <b>TOPSTAMP • {art.code}</b>
                  </div>
                  <div className="art-info">
                    <small>
                      {art.theme || art.category} •{" "}
                      {art.style || "Personalizada"}
                    </small>
                    <h3>{art.name}</h3>
                    <code>{art.code}</code>
                    <p className="art-compatible">
                      ✓ Compatível com{" "}
                      {(art.compatibleCategories || ["Canecas"])
                        .slice(0, 3)
                        .join(", ")}
                    </p>
                    <div>
                      <span>
                        {art.customizable?.length
                          ? "Personalizável"
                          : "Pronta para usar"}
                      </span>
                      <strong>
                        R$ {art.price.toFixed(2).replace(".", ",")}
                      </strong>
                    </div>
                    <div className="art-card-actions">
                      <button
                        onClick={() => {
                          setBuyingArt(art);
                          setArtModal("details");
                        }}
                      >
                        Visualizar
                      </button>
                      <button
                        onClick={() => {
                          setBuyingArt(art);
                          setArtModal("mockup");
                          setMockupStatus("idle");
                        }}
                      >
                        Ver no produto
                      </button>
                    </div>
                    <button
                      className="choose-art"
                      onClick={() => {
                        setSelectedArtCode(art.code);
                        notify(
                          `Arte ${art.code} selecionada e pronta para personalização.`,
                        );
                      }}
                    >
                      Escolher esta arte →
                    </button>
                    <p>🔒 Original protegido • vinculação por código</p>
                  </div>
                </article>
              ))}
          </section>
        </section>
      ) : activeNav === "Pessoas" ? (
        <section className="workspace module-page people-page">
          <header className="topbar">
            <button
              className="mobile-menu"
              aria-controls="main-navigation"
              aria-label="Abrir menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>
            <div>
              <p>Cadastro central • TopStamp</p>
              <h1>Pessoas</h1>
              <span>
                Clientes, fornecedores, funcionários e outros contatos em um só
                lugar.
              </span>
            </div>
            <button
              className="primary people-new"
              onClick={() => setPersonModal("type")}
            >
              ＋ Nova Pessoa
            </button>
          </header>
          <div className="people-tabs">
            {(
              [
                "Visão geral",
                "Cliente",
                "Fornecedor",
                "Funcionário",
                "Outro",
              ] as const
            ).map((tab) => (
              <button
                className={peopleTab === tab ? "active" : ""}
                key={tab}
                onClick={() => setPeopleTab(tab)}
              >
                {tab}
                {tab !== "Visão geral" && (
                  <b>{people.filter((p) => p.types.includes(tab)).length}</b>
                )}
              </button>
            ))}
          </div>
          {peopleTab === "Visão geral" ? (
            <>
              <section className="people-metrics">
                <article>
                  <i>◎</i>
                  <small>Total de pessoas</small>
                  <strong>{people.length}</strong>
                  <span>Cadastro único e centralizado</span>
                </article>
                <article>
                  <i>♙</i>
                  <small>Clientes</small>
                  <strong>
                    {people.filter((p) => p.types.includes("Cliente")).length}
                  </strong>
                  <span>Dados anteriores preservados</span>
                </article>
                <article>
                  <i>▣</i>
                  <small>Fornecedores</small>
                  <strong>
                    {
                      people.filter((p) => p.types.includes("Fornecedor"))
                        .length
                    }
                  </strong>
                  <span>Integrados a compras e estoque</span>
                </article>
                <article>
                  <i>♟</i>
                  <small>Funcionários</small>
                  <strong>
                    {
                      people.filter((p) => p.types.includes("Funcionário"))
                        .length
                    }
                  </strong>
                  <span>Acesso protegido por permissão</span>
                </article>
              </section>
              <section className="people-categories">
                {(
                  [
                    ["Cliente", "♙", "Pedidos, artes, pagamentos e histórico"],
                    [
                      "Fornecedor",
                      "▣",
                      "Compras, produtos, contas e comprovantes",
                    ],
                    [
                      "Funcionário",
                      "♟",
                      "Produção, tarefas, eventos e atividades",
                    ],
                    ["Outro", "◇", "Parceiros, técnicos, leads e contatos"],
                  ] as const
                ).map(([kind, icon, description]) => (
                  <article key={kind}>
                    <i>{icon}</i>
                    <div>
                      <small>CATEGORIA</small>
                      <h2>{kind === "Outro" ? "Outros" : `${kind}s`}</h2>
                      <p>{description}</p>
                      <b>
                        {people.filter((p) => p.types.includes(kind)).length}{" "}
                        cadastro(s) •{" "}
                        {
                          people.filter(
                            (p) =>
                              p.types.includes(kind) && p.status === "Ativo",
                          ).length
                        }{" "}
                        ativo(s)
                      </b>
                    </div>
                    <button onClick={() => setPeopleTab(kind)}>
                      Visualizar →
                    </button>
                    <button
                      className="light"
                      onClick={() => {
                        setNewPersonType(kind);
                        setPersonModal("form");
                      }}
                    >
                      ＋ Cadastrar
                    </button>
                  </article>
                ))}
              </section>
              <section className="people-latest">
                <header>
                  <div>
                    <small>ATIVIDADE RECENTE</small>
                    <h2>Últimos cadastros</h2>
                  </div>
                  <span>
                    {people.filter((p) => p.status === "Com pendência").length}{" "}
                    pessoa(s) com pendência
                  </span>
                </header>
                {people
                  .slice(-5)
                  .reverse()
                  .map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedPerson(p);
                        setPersonModal("profile");
                      }}
                    >
                      <i>{p.name.slice(0, 2).toUpperCase()}</i>
                      <span>
                        <b>{p.name}</b>
                        <small>
                          {p.code} • {p.types.join(" + ")}
                        </small>
                      </span>
                      <em className={p.status.toLowerCase().replace(" ", "-")}>
                        {p.status}
                      </em>
                    </button>
                  ))}
              </section>
            </>
          ) : (
            <section className="customers-panel people-list">
              <div className="people-list-head">
                <div>
                  <small>PESSOAS → {peopleTab.toUpperCase()}</small>
                  <h2>{peopleTab === "Outro" ? "Outros" : `${peopleTab}s`}</h2>
                </div>
                <label className="search">
                  <span>⌕</span>
                  <input
                    value={peopleQuery}
                    onChange={(e) => setPeopleQuery(e.target.value)}
                    placeholder="Buscar nome, CPF/CNPJ, telefone, cidade, código ou tag"
                  />
                </label>
              </div>
              {people
                .filter(
                  (p) =>
                    p.types.includes(peopleTab) &&
                    `${p.name} ${p.document || ""} ${p.phone} ${p.email} ${p.city} ${p.code} ${p.tags.join(" ")}`
                      .toLowerCase()
                      .includes(peopleQuery.toLowerCase()),
                )
                .map((p) => (
                  <article key={p.id}>
                    <i className="person-avatar">
                      {p.name.slice(0, 2).toUpperCase()}
                    </i>
                    <span>
                      <b>{p.name}</b>
                      <small>
                        {p.code} • {p.types.join(" + ")}
                      </small>
                    </span>
                    <span>
                      <b>{p.phone || "Sem telefone"}</b>
                      <small>
                        {p.email || "Sem e-mail"} •{" "}
                        {p.city || "Cidade não informada"}
                      </small>
                    </span>
                    <em
                      className={`person-status ${p.status.toLowerCase().replace(" ", "-")}`}
                    >
                      {p.status}
                    </em>
                    <button
                      onClick={() => {
                        setSelectedPerson(p);
                        setPersonModal("profile");
                      }}
                    >
                      Abrir perfil
                    </button>
                  </article>
                ))}
              {!people.some((p) => p.types.includes(peopleTab)) && (
                <div className="empty">
                  <span>◎</span>
                  <h3>Nenhum cadastro nesta categoria</h3>
                  <p>
                    Cadastre uma nova pessoa sem afetar os clientes e históricos
                    já existentes.
                  </p>
                  <button
                    onClick={() => {
                      setNewPersonType(peopleTab);
                      setPersonModal("form");
                    }}
                  >
                    ＋ Cadastrar {peopleTab.toLowerCase()}
                  </button>
                </div>
              )}
            </section>
          )}
        </section>
      ) : (
        <section className="workspace orders-workspace">
          <header className="topbar">
            <button
              className="mobile-menu"
              aria-controls="main-navigation"
              aria-label="Abrir menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>
            <div>
              <p>Vendas • TopStamp</p>
              <h1>Pedidos</h1>
              <span>
                Orçamentos, pedidos e ordens de serviço em um único fluxo.
              </span>
            </div>
            <button
              className="primary"
              onClick={() => {
                setSelectedOrder(null);
                setOrderModal("new");
              }}
            >
              <b>＋</b> Criar documento
            </button>
          </header>
          <section className="metrics order-metrics">
            <article className="metric cyan">
              <div>▢</div>
              <span>
                Pedidos ativos<strong>{orders.length}</strong>
                <small>Todos os pedidos</small>
              </span>
            </article>
            <article className="metric amber">
              <div>⌁</div>
              <span>
                Em produção
                <strong>
                  {orders.filter((o) => o.status === "Em produção").length}
                </strong>
                <small>Acompanhar prazos</small>
              </span>
            </article>
            <article className="metric violet">
              <div>✦</div>
              <span>
                Arte pendente
                <strong>
                  {orders.filter((o) => o.status === "Arte pendente").length}
                </strong>
                <small>Aguardando aprovação</small>
              </span>
            </article>
            <article className="metric red">
              <div>$</div>
              <span>
                Total em pedidos
                <strong className="money">
                  R${" "}
                  {orders
                    .reduce((sum, o) => sum + orderTotal(o), 0)
                    .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </strong>
                <small>Valor acumulado</small>
              </span>
            </article>
          </section>
          <div className="document-tabs">
            {(["Orçamento", "Pedido", "Ordem de serviço"] as const).map(
              (kind) => (
                <button
                  key={kind}
                  className={orderView === kind ? "active" : ""}
                  onClick={() => setOrderView(kind)}
                >
                  {kind}
                  <b>{orders.filter((o) => documentType(o) === kind).length}</b>
                </button>
              ),
            )}
          </div>
          <div className="orders-toolbar">
            <label className="search">
              <span>⌕</span>
              <input
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                placeholder={`Buscar em ${orderView.toLowerCase()}`}
              />
            </label>
            <select
              value={orderView}
              onChange={(e) => setOrderView(e.target.value as typeof orderView)}
            >
              <option>Orçamento</option>
              <option>Pedido</option>
              <option>Ordem de serviço</option>
            </select>
          </div>
          <section className="orders-panel">
            <div className="orders-head">
              <div>
                <h2>{orderView}</h2>
                <p>{visibleOrders.length} registro(s) encontrado(s)</p>
              </div>
            </div>
            <div className="orders-table">
              <div className="order-row order-row-head">
                <span>Documento / cliente</span>
                <span>Entrega</span>
                <span>Status</span>
                <span>Total</span>
                <span>Ações</span>
              </div>
              {visibleOrders.map((order) => (
                <div className="order-row" key={order.id}>
                  <span>
                    <b>{order.id}</b>
                    <small>
                      {order.customer}
                      <br />
                      {order.phone}
                    </small>
                  </span>
                  <span>
                    <b>{order.delivery}</b>
                    <small>Criado em {order.date}</small>
                  </span>
                  <span>
                    <em
                      className={`status-pill ${order.status.toLowerCase().replace(" ", "-")}`}
                    >
                      {order.status}
                    </em>
                    <small>{order.payment}</small>
                  </span>
                  <span>
                    <b>R$ {orderTotal(order).toFixed(2).replace(".", ",")}</b>
                    <small>
                      {order.items.reduce((s, i) => s + i.quantity, 0)} itens
                    </small>
                  </span>
                  <span className="order-actions">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setOrderModal("details");
                      }}
                    >
                      Ver
                    </button>
                    <button
                      title="Enviar por WhatsApp"
                      onClick={() => sendOrderWhatsApp(order)}
                    >
                      WhatsApp
                    </button>
                    <button
                      title="Baixar PDF"
                      onClick={() => makePdf(order, "download")}
                    >
                      PDF
                    </button>
                  </span>
                </div>
              ))}
            </div>
          </section>
        </section>
      )}

      {productionOrder && (
        <div className="modal-backdrop">
          <section className="modal production-details">
            <button
              className="close"
              onClick={() => {
                setProductionOrder(null);
                setNextProductionStatus(null);
              }}
            >
              ×
            </button>
            <header className="production-detail-head">
              <div>
                <small>DETALHES DA PRODUÇÃO</small>
                <h2>{productionOrder.id}</h2>
                <p>
                  {productionOrder.customer} • entrega{" "}
                  {productionOrder.delivery}
                </p>
              </div>
              <em>{currentProductionStatus(productionOrder)}</em>
            </header>
            <div className="production-summary">
              <span>
                <small>Cliente / WhatsApp</small>
                <b>{productionOrder.customer}</b>
                <p>{productionOrder.phone}</p>
              </span>
              <span>
                <small>Responsável</small>
                <b>{productionOrder.productionOwner || "Equipe TopStamp"}</b>
                <p>Prioridade: {productionOrder.priority || "Normal"}</p>
              </span>
              <span>
                <small>Financeiro</small>
                <b>{productionOrder.payment}</b>
                <p>
                  {productionOrder.paymentVerification || "Sem comprovante"}
                </p>
              </span>
              <span>
                <small>Previsão</small>
                <b>{productionOrder.delivery}</b>
                <p>Forma de entrega: retirada</p>
              </span>
            </div>
            <div className="production-detail-grid">
              <section>
                <h3>Produtos do pedido</h3>
                {productionOrder.items.map((item, index) => (
                  <article className="production-product" key={index}>
                    <div>📦</div>
                    <span>
                      <small>
                        ITEM {index + 1} • {item.variation}
                      </small>
                      <b>
                        {item.quantity}× {item.name}
                      </b>
                      <p>Personalização vinculada • Arte do pedido</p>
                    </span>
                    <em>{currentProductionStatus(productionOrder)}</em>
                  </article>
                ))}
              </section>
              <section className="art-files">
                <h3>Arte e Arquivos</h3>
                <div>
                  <b>🎨 Prévia protegida</b>
                  <small>Código da arte vinculado ao pedido</small>
                </div>
                <p>
                  🔒 Arquivos internos só ficam disponíveis conforme a
                  permissão.
                </p>
                <button
                  onClick={() => notify("Abrindo a arte vinculada ao pedido.")}
                >
                  Visualizar arte
                </button>
                <button onClick={() => notify("Arte marcada como aprovada.")}>
                  Marcar como aprovada
                </button>
              </section>
            </div>
            <section className="status-control">
              <h3>Alterar Status da Produção</h3>
              <div>
                <select
                  value={nextProductionStatus || ""}
                  onChange={(e) =>
                    setNextProductionStatus(e.target.value as ProductionStatus)
                  }
                >
                  <option value="">Selecione o novo status</option>
                  {productionStatuses.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                <button
                  className="primary"
                  disabled={!nextProductionStatus}
                  onClick={() => {}}
                >
                  Continuar
                </button>
              </div>
            </section>
            {nextProductionStatus && (
              <section className="status-confirm">
                <h3>Confirmar alteração</h3>
                <p>
                  Deseja alterar o status deste pedido e atualizar todas as
                  áreas relacionadas?
                </p>
                <div className="status-change">
                  <span>
                    <small>Status atual</small>
                    <b>{currentProductionStatus(productionOrder)}</b>
                  </span>
                  <b>→</b>
                  <span>
                    <small>Novo status</small>
                    <b>{nextProductionStatus}</b>
                  </span>
                </div>
                <textarea
                  placeholder="Observação da alteração"
                  value={productionNote}
                  onChange={(e) => setProductionNote(e.target.value)}
                />
                <div className="notify-options">
                  <label>
                    <input
                      type="checkbox"
                      checked={notifyCustomer}
                      onChange={(e) => setNotifyCustomer(e.target.checked)}
                    />{" "}
                    Notificar cliente
                  </label>
                  <select
                    value={notificationChannel}
                    onChange={(e) => setNotificationChannel(e.target.value)}
                  >
                    <option>WhatsApp</option>
                    <option>E-mail</option>
                    <option>Área do cliente</option>
                    <option>SMS</option>
                    <option>Push</option>
                  </select>
                </div>
                <div className="modal-actions">
                  <button onClick={() => setNextProductionStatus(null)}>
                    Cancelar
                  </button>
                  <button className="primary" onClick={confirmProductionStatus}>
                    Confirmar alteração
                  </button>
                </div>
              </section>
            )}
            <section className="production-history">
              <h3>Linha do tempo</h3>
              {(productionOrder.productionHistory || []).length ? (
                (productionOrder.productionHistory || []).map((h, i) => (
                  <article key={i}>
                    <i>✓</i>
                    <span>
                      <b>{h.date}</b>
                      <p>
                        Status alterado de “{h.previous}” para “{h.status}”
                      </p>
                      <small>
                        {h.user} •{" "}
                        {h.notified
                          ? `Cliente notificado por ${h.channel}`
                          : "Sem notificação"}
                        {h.note ? ` • ${h.note}` : ""}
                      </small>
                    </span>
                  </article>
                ))
              ) : (
                <p className="history-empty">
                  As próximas alterações aparecerão aqui com data, responsável e
                  notificação.
                </p>
              )}
            </section>
            <div className="production-quick-actions">
              <button
                onClick={() =>
                  notify("Ordem de produção preparada para impressão.")
                }
              >
                🖨 Imprimir ordem
              </button>
              <button onClick={() => notify("PDF da produção gerado.")}>
                ▣ Gerar PDF
              </button>
              <button onClick={() => notify("Canal de atendimento aberto.")}>
                ◉ Enviar mensagem
              </button>
              <button
                onClick={() => setNextProductionStatus("Produção pausada")}
              >
                Ⅱ Pausar produção
              </button>
            </div>
          </section>
        </div>
      )}

      {cartOpen && (
        <div className="cart-overlay" onMouseDown={() => setCartOpen(false)}>
          <aside
            className="cart-drawer"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button className="cart-close" onClick={() => setCartOpen(false)}>
              ×
            </button>
            <span className="cart-kicker">SUA SELEÇÃO</span>
            <h2>
              Orçamento <b>{cartCount}</b>
            </h2>
            <p>Revise os itens e envie sua solicitação.</p>
            <div className="cart-items">
              {cart.map((item) => (
                <article key={item.product.id}>
                  <div className={`cart-thumb ${item.product.gradient}`}>
                    {item.product.images[0] ? (
                      <img src={item.product.images[0]} alt="" />
                    ) : (
                      <span>{item.product.emoji}</span>
                    )}
                  </div>
                  <div>
                    <strong>{item.product.name}</strong>
                    <select
                      value={item.variation}
                      onChange={(e) =>
                        setCart((c) =>
                          c.map((x) =>
                            x.product.id === item.product.id
                              ? { ...x, variation: e.target.value }
                              : x,
                          ),
                        )
                      }
                    >
                      {item.product.variations.map((v) => (
                        <option key={v}>{v}</option>
                      ))}
                    </select>
                    <span className="qty">
                      <button
                        onClick={() =>
                          updateCart(item.product.id, item.quantity - 1)
                        }
                      >
                        −
                      </button>
                      <b>{item.quantity}</b>
                      <button
                        onClick={() =>
                          updateCart(item.product.id, item.quantity + 1)
                        }
                      >
                        ＋
                      </button>
                    </span>
                    {item.quantity >= item.product.wholesaleMin ? (
                      <em className="wholesale-applied">
                        ✓ Valor de atacado aplicado
                      </em>
                    ) : (
                      <small className="wholesale-progress">
                        Mais {item.product.wholesaleMin - item.quantity} un.
                        para preço de atacado
                      </small>
                    )}
                  </div>
                  <b>
                    R${" "}
                    {(
                      item.quantity *
                      (item.quantity >= item.product.wholesaleMin
                        ? item.product.wholesalePrice
                        : item.product.retailPrice)
                    )
                      .toFixed(2)
                      .replace(".", ",")}
                  </b>
                </article>
              ))}
              {!cart.length && (
                <div className="cart-empty">
                  🛍<b>Sua seleção está vazia</b>
                  <span>Escolha produtos para montar seu orçamento.</span>
                </div>
              )}
            </div>
            <div className="cart-summary">
              <label className="first-purchase">
                <input
                  type="checkbox"
                  checked={firstPurchase}
                  onChange={(e) => setFirstPurchase(e.target.checked)}
                />
                <span>
                  <b>Esta é minha primeira compra</b>
                  <small>Desconto automático de 10%</small>
                </span>
              </label>
              <span className="subtotal">
                Subtotal <b>R$ {cartTotal.toFixed(2).replace(".", ",")}</b>
              </span>
              {firstPurchase && (
                <span className="discount-line">
                  Desconto primeira compra{" "}
                  <b>
                    − R$ {firstPurchaseDiscount.toFixed(2).replace(".", ",")}
                  </b>
                </span>
              )}
              <span className="grand-total">
                Total estimado{" "}
                <b>R$ {finalCartTotal.toFixed(2).replace(".", ",")}</b>
              </span>
              <small>
                O valor final pode variar conforme arte, acabamento e entrega.
              </small>
              <button
                className="quote-button"
                onClick={() => sendWhatsApp("orcamento")}
              >
                ◉ Pedir orçamento no WhatsApp
              </button>
              <button
                className="buy-button"
                onClick={() => sendWhatsApp("compra")}
              >
                Solicitar compra →
              </button>
            </div>
          </aside>
        </div>
      )}

      {cartOpen && cart.length > 0 && (
        <form
          id="customer-checkout"
          className="customer-checkout"
          onSubmit={finishStoreOrder}
        >
          <h3>Finalizar compra</h3>
          <p>
            Ao finalizar, o cliente será salvo, o pedido entrará em “Aguardando
            confirmação” e o resumo será aberto automaticamente no WhatsApp.
          </p>
          <input name="name" required placeholder="Nome completo ou empresa" />
          <div>
            <input name="phone" required placeholder="WhatsApp" />
            <input name="email" type="email" placeholder="E-mail (opcional)" />
          </div>
          <input name="city" required placeholder="Cidade / Estado" />
          <textarea
            name="details"
            rows={3}
            defaultValue={orderDetails}
            placeholder="Detalhes do pedido, tema, cores, prazo e observações"
          />
          <button className="buy-button">
            Finalizar compra e enviar ao WhatsApp →
          </button>
        </form>
      )}

      {storeProduct && (
        <div
          className="modal-backdrop"
          onMouseDown={() => setStoreProduct(null)}
        >
          <section
            className="modal store-detail"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button className="close" onClick={() => setStoreProduct(null)}>
              ×
            </button>
            <div className={`store-detail-image ${storeProduct.gradient}`}>
              {storeProduct.images[0] ? (
                <img src={storeProduct.images[0]} alt={storeProduct.name} />
              ) : (
                <span>{storeProduct.emoji}</span>
              )}
            </div>
            <div>
              <small>
                {storeProduct.code} • {storeProduct.category}
              </small>
              <h2>{storeProduct.name}</h2>
              <p>
                Produto personalizado sob medida. Escolha a opção, informe a
                quantidade e selecione uma arte protegida.
              </p>
              <label>
                Modelo / variação
                <select
                  value={storeVariation}
                  onChange={(e) => setStoreVariation(e.target.value)}
                >
                  {storeProduct.variations.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>
              <label>
                Quantidade
                <input
                  type="number"
                  min="1"
                  value={storeQuantity}
                  onChange={(e) =>
                    setStoreQuantity(Math.max(1, Number(e.target.value)))
                  }
                />
              </label>
              <label>
                Escolher arte <small>Opcional • identificada pelo código</small>
                <select
                  value={selectedArtCode}
                  onChange={(e) => setSelectedArtCode(e.target.value)}
                >
                  <option value="">
                    Vou enviar minha própria arte / decidir depois
                  </option>
                  {arts
                    .filter(
                      (a) =>
                        a.active &&
                        (!a.compatibleCategories?.length ||
                          a.compatibleCategories.includes(
                            storeProduct.category,
                          )),
                    )
                    .map((a) => (
                      <option value={a.code} key={a.code}>
                        {a.code} — {a.name} ({a.category})
                      </option>
                    ))}
                </select>
              </label>
              {selectedArtCode && (
                <div className="selected-art-note">
                  🔒 Arte <b>{selectedArtCode}</b> vinculada ao pedido. Arquivo
                  não disponível para download.
                </div>
              )}
              <label>
                Detalhes para o pedido
                <textarea
                  rows={3}
                  value={orderDetails}
                  onChange={(e) => setOrderDetails(e.target.value)}
                  placeholder="Tema, nome, cores, data do evento..."
                />
              </label>
              <div className="detail-price">
                <span>Valor estimado</span>
                <strong>
                  R${" "}
                  {(
                    storeQuantity *
                    (storeQuantity >= storeProduct.wholesaleMin
                      ? storeProduct.wholesalePrice
                      : storeProduct.retailPrice)
                  )
                    .toFixed(2)
                    .replace(".", ",")}
                </strong>
              </div>
              {storeQuantity >= storeProduct.wholesaleMin && (
                <em className="wholesale-applied">
                  ✓ Preço de atacado aplicado
                </em>
              )}
              <button
                className="primary store-add"
                onClick={addConfiguredProduct}
              >
                Adicionar {storeQuantity} ao carrinho →
              </button>
            </div>
          </section>
        </div>
      )}

      {artModal && (
        <div className="modal-backdrop" onMouseDown={() => setArtModal(null)}>
          <section className="modal" onMouseDown={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setArtModal(null)}>
              ×
            </button>
            <span className="modal-icon">🎨</span>
            <h2>
              {artModal === "new"
                ? "Cadastrar nova arte"
                : artModal === "details"
                  ? "Detalhes da Arte"
                  : artModal === "mockup"
                    ? "Prévia inteligente no produto"
                    : "Comprar arte avulsa"}
            </h2>
            <p>
              {artModal === "new"
                ? "Defina a categoria e o valor de venda no painel administrativo."
                : artModal === "details"
                  ? `${buyingArt?.code} — confira compatibilidade, personalização e área segura.`
                  : artModal === "mockup"
                    ? "A simulação visual não substitui o arquivo de produção."
                    : `${buyingArt?.code} — ${buyingArt?.name}. O arquivo continuará protegido até a confirmação do pagamento.`}
            </p>
            {artModal === "new" ? (
              <form onSubmit={saveArt}>
                <label>
                  Nome da arte
                  <input
                    name="name"
                    required
                    autoFocus
                    placeholder="Ex.: Jardim Encantado"
                  />
                </label>
                <label>
                  Categoria
                  <input
                    name="category"
                    required
                    placeholder="Ex.: Festas infantis"
                  />
                </label>
                <div className="form-row">
                  <label>
                    Tema
                    <input name="theme" placeholder="Ex.: Dia das Mães" />
                  </label>
                  <label>
                    Estilo
                    <input name="style" placeholder="Ex.: Floral" />
                  </label>
                </div>
                <label>
                  Produtos compatíveis
                  <div className="compatibility-checks">
                    {Array.from(new Set(products.map((p) => p.category))).map(
                      (c) => (
                        <label key={c}>
                          <input
                            type="checkbox"
                            name="compatibleCategories"
                            value={c}
                          />
                          {c}
                        </label>
                      ),
                    )}
                  </div>
                </label>
                <label>
                  Campos personalizáveis
                  <input
                    name="customizable"
                    placeholder="Nome, idade, data, foto"
                  />
                </label>
                <label>
                  Valor da arte avulsa (R$)
                  <input
                    name="price"
                    required
                    type="number"
                    min="0"
                    step="0.01"
                  />
                </label>
                <div className="modal-actions">
                  <button type="button" onClick={() => setArtModal(null)}>
                    Cancelar
                  </button>
                  <button className="primary">Salvar arte</button>
                </div>
              </form>
            ) : artModal === "details" ? (
              <div className="art-details-modal">
                <div className={`art-detail-visual ${buyingArt?.gradient}`}>
                  <span>{buyingArt?.emoji}</span>
                  <b>{buyingArt?.code}</b>
                </div>
                <div className="art-detail-list">
                  <span>
                    <small>Tema e estilo</small>
                    <b>
                      {buyingArt?.theme || buyingArt?.category} •{" "}
                      {buyingArt?.style || "Personalizada"}
                    </b>
                  </span>
                  <span>
                    <small>Produtos compatíveis</small>
                    <b>
                      {buyingArt?.compatibleCategories?.join(" • ") ||
                        "Consulte a compatibilidade"}
                    </b>
                  </span>
                  <span>
                    <small>Personalização</small>
                    <b>
                      {buyingArt?.customizable?.join(" • ") || "Arte pronta"}
                    </b>
                  </span>
                  <span>
                    <small>Área segura</small>
                    <b>Validada conforme o produto e a variação</b>
                  </span>
                </div>
                <div className="modal-actions">
                  <button onClick={() => setArtModal(null)}>
                    Voltar ao catálogo
                  </button>
                  <button
                    onClick={() => setArtModal("mockup")}
                    className="primary"
                  >
                    Aplicar no produto →
                  </button>
                </div>
              </div>
            ) : artModal === "mockup" ? (
              <div className="mockup-studio">
                <div className="mockup-canvas">
                  <span>☕</span>
                  <i>{buyingArt?.emoji}</i>
                  {mockupStatus === "generating" && (
                    <b>IA gerando prévia segura…</b>
                  )}
                  {mockupStatus === "ready" && (
                    <em>PRÉVIA REALISTA • {buyingArt?.code}</em>
                  )}
                </div>
                <div className="mockup-fields">
                  {buyingArt?.customizable?.map((field) => (
                    <label key={field}>
                      {field}
                      <input placeholder={`Informe ${field.toLowerCase()}`} />
                    </label>
                  ))}
                </div>
                <div className="mockup-controls">
                  <button>−</button>
                  <button>＋</button>
                  <button>←</button>
                  <button>↑</button>
                  <button>↓</button>
                  <button>→</button>
                  <button>Centralizar</button>
                  <button>Girar</button>
                </div>
                <p className="mockup-warning">
                  Esta imagem é uma simulação visual. Pequenas diferenças de
                  cor, escala ou posicionamento podem ocorrer no produto final.
                </p>
                <div className="modal-actions">
                  <button onClick={() => setArtModal("details")}>
                    Escolher outra arte
                  </button>
                  {mockupStatus !== "ready" ? (
                    <button
                      className="primary"
                      disabled={mockupStatus === "generating"}
                      onClick={() => {
                        setMockupStatus("generating");
                        window.setTimeout(() => setMockupStatus("ready"), 1300);
                      }}
                    >
                      {mockupStatus === "generating"
                        ? "Gerando…"
                        : "Gerar prévia com IA"}
                    </button>
                  ) : (
                    <button
                      className="primary"
                      onClick={() => {
                        if (buyingArt) setSelectedArtCode(buyingArt.code);
                        setArtModal(null);
                        notify(
                          "Arte selecionada e vinculada ao produto com sucesso.",
                        );
                      }}
                    >
                      Aprovar esta arte ✓
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={requestArtPurchase}>
                <label>
                  Nome completo
                  <input name="name" required autoFocus />
                </label>
                <label>
                  WhatsApp cadastrado
                  <input name="phone" required placeholder="(62) 99999-9999" />
                </label>
                <div className="download-policy">
                  Após o pagamento ser localizado, o administrador enviará para
                  este WhatsApp um link individual com permissão para download.
                </div>
                <div className="modal-actions">
                  <button type="button" onClick={() => setArtModal(null)}>
                    Cancelar
                  </button>
                  <button className="primary">Solicitar pelo WhatsApp →</button>
                </div>
              </form>
            )}
          </section>
        </div>
      )}

      {cartOpen && cart.length > 0 && (
        <div className="checkout-fab">
          <button
            onClick={() => {
              const el = document.getElementById("customer-checkout");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Preencher dados do cliente ↓
          </button>
        </div>
      )}

      {orderModal && (
        <div className="modal-backdrop" onMouseDown={() => setOrderModal(null)}>
          <section
            className="modal order-modal"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button className="close" onClick={() => setOrderModal(null)}>
              ×
            </button>
            {orderModal === "new" ? (
              <>
                <span className="modal-icon">▢</span>
                <h2>Criar documento</h2>
                <p>
                  Selecione o cliente e adicione todos os produtos desta venda.
                </p>
                <form onSubmit={newOrder}>
                  <label>
                    Tipo de documento
                    <select name="documentType" defaultValue={orderView}>
                      <option>Orçamento</option>
                      <option>Pedido</option>
                      <option>Ordem de serviço</option>
                    </select>
                  </label>
                  <label>
                    Nome do cliente
                    <select
                      name="customerId"
                      required
                      autoFocus
                      value={newOrderCustomerId}
                      onChange={(e) => setNewOrderCustomerId(e.target.value)}
                    >
                      <option value="">Selecione um cliente cadastrado</option>
                      {customers.map((customer) => (
                        <option value={customer.id} key={customer.id}>
                          {customer.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  {newOrderCustomerId &&
                    (() => {
                      const customer = customers.find(
                        (item) => String(item.id) === newOrderCustomerId,
                      );
                      return customer ? (
                        <div className="selected-customer-data">
                          <b>Dados carregados do cadastro</b>
                          <span>
                            WhatsApp: {customer.phone || "Não informado"}
                          </span>
                          <span>
                            E-mail: {customer.email || "Não informado"}
                          </span>
                          <span>
                            Cidade: {customer.city || "Não informada"}
                          </span>
                          {customer.notes && (
                            <small>Observações: {customer.notes}</small>
                          )}
                        </div>
                      ) : null;
                    })()}{" "}
                  {!customers.length && (
                    <div className="download-policy">
                      Cadastre primeiro um cliente em Pessoas → Clientes ou
                      finalize uma compra na Loja Virtual.
                    </div>
                  )}
                  <label>
                    Data de entrega
                    <input name="delivery" type="date" required />
                  </label>
                  <label>
                    Vencimento do orçamento
                    <input name="quoteDueDate" type="date" />
                    <small>Aplicado quando o documento for um orçamento.</small>
                  </label>
                  <label>
                    Dados de pagamento
                    <textarea
                      name="paymentDetails"
                      rows={3}
                      placeholder="Ex.: PIX 00.000.000/0001-00 • TopStamp Personalizados"
                    />
                    <small>Essas informações serão exibidas ao cliente.</small>
                  </label>
                  <label>
                    Percentual da entrada
                    <input
                      name="entryPercent"
                      type="number"
                      min="1"
                      max="100"
                      defaultValue="50"
                    />
                    <small>
                      O valor da entrada será calculado automaticamente.
                    </small>
                  </label>
                  <div className="multi-products">
                    <div className="multi-products-title">
                      <b>Produtos do pedido</b>
                      <button type="button" onClick={addNewOrderItem}>
                        ＋ Adicionar produto
                      </button>
                    </div>
                    {newOrderItems.map((item, index) => {
                      const product =
                        products.find(
                          (productItem) => productItem.id === item.productId,
                        ) ?? products[0];
                      const unitPrice =
                        item.quantity >= product.wholesaleMin
                          ? product.wholesalePrice
                          : product.retailPrice;
                      return (
                        <div
                          className="multi-product-row"
                          key={`${item.productId}-${index}`}
                        >
                          <label>
                            Produto
                            <select
                              value={item.productId}
                              onChange={(e) =>
                                updateNewOrderItem(index, {
                                  productId: Number(e.target.value),
                                })
                              }
                            >
                              {products.map((productItem) => (
                                <option
                                  value={productItem.id}
                                  key={productItem.id}
                                >
                                  {productItem.name}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label>
                            Quantidade
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                updateNewOrderItem(index, {
                                  quantity: Math.max(1, Number(e.target.value)),
                                })
                              }
                            />
                          </label>
                          <span>
                            <small>
                              {item.quantity >= product.wholesaleMin
                                ? "Atacado"
                                : "Varejo"}
                            </small>
                            <b>
                              R${" "}
                              {(unitPrice * item.quantity)
                                .toFixed(2)
                                .replace(".", ",")}
                            </b>
                          </span>
                          <button
                            type="button"
                            className="remove-item"
                            disabled={newOrderItems.length === 1}
                            onClick={() => removeNewOrderItem(index)}
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                    <div className="multi-products-total">
                      <span>Total estimado</span>
                      <strong>
                        R${" "}
                        {newOrderItems
                          .reduce((sum, item) => {
                            const product =
                              products.find(
                                (productItem) =>
                                  productItem.id === item.productId,
                              ) ?? products[0];
                            return (
                              sum +
                              item.quantity *
                                (item.quantity >= product.wholesaleMin
                                  ? product.wholesalePrice
                                  : product.retailPrice)
                            );
                          }, 0)
                          .toFixed(2)
                          .replace(".", ",")}
                      </strong>
                    </div>
                  </div>
                  <div className="modal-actions">
                    <button type="button" onClick={() => setOrderModal(null)}>
                      Cancelar
                    </button>
                    <button
                      className="primary"
                      disabled={!customers.length || !newOrderItems.length}
                    >
                      Criar e salvar
                    </button>
                  </div>
                </form>
              </>
            ) : (
              selectedOrder && (
                <>
                  <div className="print-header">
                    <span className="modal-icon">▢</span>
                    <div>
                      <h2>
                        {documentType(selectedOrder)} {selectedOrder.id}
                      </h2>
                      <p>
                        {selectedOrder.customer} • {selectedOrder.phone}
                      </p>
                    </div>
                  </div>
                  <div className="order-meta">
                    <span>
                      <small>CRIADO EM</small>
                      <b>{selectedOrder.date}</b>
                    </span>
                    <span>
                      <small>ENTREGA</small>
                      <b>{selectedOrder.delivery}</b>
                    </span>
                    <span>
                      <small>STATUS</small>
                      <b>{selectedOrder.status}</b>
                    </span>
                  </div>
                  {(selectedOrder.quoteDueDate ||
                    selectedOrder.paymentDetails) && (
                    <div className="payment-instructions">
                      {selectedOrder.quoteDueDate && (
                        <span>
                          <small>VENCIMENTO DO ORÇAMENTO</small>
                          <b>
                            {new Date(
                              `${selectedOrder.quoteDueDate}T12:00:00`,
                            ).toLocaleDateString("pt-BR")}
                          </b>
                        </span>
                      )}
                      {selectedOrder.paymentDetails && (
                        <span>
                          <small>DADOS DE PAGAMENTO</small>
                          <b>{selectedOrder.paymentDetails}</b>
                        </span>
                      )}
                    </div>
                  )}
                  {["Orçamento", "Ordem de serviço"].includes(
                    documentType(selectedOrder),
                  ) &&
                    (() => {
                      const total = orderTotal(selectedOrder);
                      const entry =
                        selectedOrder.paymentExpected ||
                        total * ((selectedOrder.entryPercent || 50) / 100);
                      const due = selectedOrder.quoteDueDate
                        ? new Date(`${selectedOrder.quoteDueDate}T12:00:00`)
                        : new Date();
                      const days = Math.ceil(
                        (due.getTime() - Date.now()) / 86400000,
                      );
                      const expired = days < 0;
                      return (
                        <section className="client-payment-flow">
                          <div
                            className={`validity-banner ${expired ? "expired" : days <= 2 ? "warning" : "valid"}`}
                          >
                            <span>
                              <small>VALIDADE DA PROPOSTA</small>
                              <b>
                                {expired
                                  ? "Proposta vencida"
                                  : `${Math.max(0, days)} dia(s) restante(s)`}
                              </b>
                            </span>
                            <p>
                              Emitido em {selectedOrder.date} • Válido até{" "}
                              {due.toLocaleDateString("pt-BR")}
                            </p>
                            {expired && (
                              <em>
                                Este orçamento expirou. Entre em contato para
                                solicitar uma nova condição.
                              </em>
                            )}
                          </div>
                          <div className="entry-summary">
                            <h3>Pagamento da Entrada</h3>
                            <span>
                              <small>Valor total</small>
                              <b>R$ {total.toFixed(2).replace(".", ",")}</b>
                            </span>
                            <span>
                              <small>
                                Entrada ({selectedOrder.entryPercent || 50}%)
                              </small>
                              <b>R$ {entry.toFixed(2).replace(".", ",")}</b>
                            </span>
                            <span>
                              <small>Saldo restante</small>
                              <b>
                                R${" "}
                                {(total - entry).toFixed(2).replace(".", ",")}
                              </b>
                            </span>
                          </div>
                          <div className="pix-panel">
                            <div className="pix-qr">PIX</div>
                            <span>
                              <small>PAGAR COM PIX</small>
                              <h3>{settings.businessName}</h3>
                              <p>
                                {selectedOrder.paymentDetails ||
                                  settings.pixKey ||
                                  "Cadastre a chave PIX em Configurações"}
                              </p>
                              <b>R$ {entry.toFixed(2).replace(".", ",")}</b>
                            </span>
                            <div className="pix-actions">
                              <button
                                disabled={expired}
                                onClick={() =>
                                  copyPix(
                                    selectedOrder.paymentDetails ||
                                      settings.pixKey,
                                    "Chave PIX",
                                  )
                                }
                              >
                                Copiar chave PIX
                              </button>
                              <button
                                disabled={expired}
                                onClick={() => openPix(selectedOrder)}
                              >
                                Abrir PIX
                              </button>
                              <button
                                onClick={() => sendOrderWhatsApp(selectedOrder)}
                              >
                                Compartilhar cobrança
                              </button>
                            </div>
                          </div>
                        </section>
                      );
                    })()}
                  {selectedOrder.customerData && (
                    <div className="selected-customer-data">
                      <b>Dados do cliente</b>
                      <span>
                        {selectedOrder.customerData.email ||
                          "E-mail não informado"}
                      </span>
                      <span>
                        {selectedOrder.customerData.city ||
                          "Cidade não informada"}
                      </span>
                      {selectedOrder.customerData.notes && (
                        <small>{selectedOrder.customerData.notes}</small>
                      )}
                    </div>
                  )}
                  <div className="order-items">
                    {selectedOrder.items.map((item, i) => (
                      <div key={i}>
                        <span>
                          <b>{item.name}</b>
                          <small>{item.variation}</small>
                        </span>
                        <span>
                          {item.quantity} × R${" "}
                          {item.unitPrice.toFixed(2).replace(".", ",")}
                        </span>
                        <strong>
                          R${" "}
                          {(item.quantity * item.unitPrice)
                            .toFixed(2)
                            .replace(".", ",")}
                        </strong>
                      </div>
                    ))}
                  </div>
                  <div className="order-total">
                    <span>Total</span>
                    <strong>
                      R${" "}
                      {orderTotal(selectedOrder).toFixed(2).replace(".", ",")}
                    </strong>
                  </div>
                  {documentType(selectedOrder) === "Pedido" && (
                    <div className="payment-box">
                      <b>Pagamento: {selectedOrder.payment}</b>
                      <small>
                        Pago: R${" "}
                        {(selectedOrder.amountPaid ?? 0)
                          .toFixed(2)
                          .replace(".", ",")}{" "}
                        • Restante: R${" "}
                        {Math.max(
                          0,
                          orderTotal(selectedOrder) -
                            (selectedOrder.amountPaid ?? 0),
                        )
                          .toFixed(2)
                          .replace(".", ",")}
                      </small>
                      <div>
                        <button
                          onClick={() =>
                            updatePayment(selectedOrder, "Entrada")
                          }
                        >
                          Registrar entrada
                        </button>
                        <button
                          onClick={() =>
                            updatePayment(selectedOrder, "Restante")
                          }
                        >
                          Pagar restante
                        </button>
                        <button
                          onClick={() =>
                            updatePayment(selectedOrder, "Concluído")
                          }
                        >
                          Pagamento concluído
                        </button>
                      </div>
                      <div className="standalone-payment-row">
                        <input
                          aria-label="Valor do pagamento avulso"
                          inputMode="decimal"
                          placeholder="Valor avulso (R$)"
                          value={standalonePayment}
                          onChange={(event) =>
                            setStandalonePayment(event.target.value)
                          }
                        />
                        <button
                          onClick={() => addStandalonePayment(selectedOrder)}
                        >
                          + Adicionar pagamento avulso
                        </button>
                      </div>
                      {!!selectedOrder.payments?.length && (
                        <div className="payment-history">
                          {selectedOrder.payments.map((payment) => (
                            <small key={payment.id}>
                              {payment.date} • {payment.note}{" "}
                              <b>
                                R$ {payment.amount.toFixed(2).replace(".", ",")}
                              </b>
                            </small>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  <div
                    className={`proof-box ${selectedOrder.paymentVerification === "Aguardando verificação" ? "waiting" : ""}`}
                  >
                    <div>
                      <small>COMPROVANTE DE PAGAMENTO</small>
                      <b>
                        {selectedOrder.paymentVerification ?? "Sem comprovante"}
                      </b>
                      {selectedOrder.paymentProof && (
                        <span>
                          {selectedOrder.paymentProof.name} •{" "}
                          {selectedOrder.paymentProof.uploadedAt}
                        </span>
                      )}
                    </div>
                    {selectedOrder.paymentProof && (
                      <a
                        href={selectedOrder.paymentProof.dataUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Visualizar
                      </a>
                    )}
                    <label className="upload-proof">
                      {selectedOrder.paymentProof
                        ? "Substituir antes da análise"
                        : "Anexar comprovante"}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,application/pdf"
                        onChange={(event) =>
                          attachPaymentProof(
                            selectedOrder,
                            event.target.files?.[0],
                          )
                        }
                      />
                    </label>
                    <button onClick={() => copyProofLink(selectedOrder)}>
                      Copiar link para o cliente
                    </button>
                    {selectedOrder.paymentVerification ===
                      "Aguardando verificação" && (
                      <div className="verification-actions">
                        <button
                          onClick={() =>
                            verifyPayment(selectedOrder, "Pagamento confirmado")
                          }
                        >
                          ✓ Confirmar
                        </button>
                        <button
                          onClick={() =>
                            verifyPayment(selectedOrder, "Pagamento rejeitado")
                          }
                        >
                          × Rejeitar
                        </button>
                      </div>
                    )}
                    {selectedOrder.paymentVerification ===
                      "Pagamento confirmado" && (
                      <div className="payment-approved">
                        <b>Pagamento confirmado</b>
                        <span>
                          R${" "}
                          {(selectedOrder.paymentExpected || 0)
                            .toFixed(2)
                            .replace(".", ",")}{" "}
                          • {selectedOrder.paymentConfirmedAt} •{" "}
                          {selectedOrder.paymentConfirmedBy}
                        </span>
                        <small>
                          Lançado no Financeiro e Produção liberada.
                        </small>
                      </div>
                    )}
                    {selectedOrder.paymentVerification ===
                      "Pagamento rejeitado" && (
                      <div className="payment-rejected">
                        <b>Pagamento reprovado</b>
                        <span>{selectedOrder.rejectionReason}</span>
                        <small>
                          Nenhum valor foi lançado. Envie um novo comprovante.
                        </small>
                      </div>
                    )}
                  </div>
                  {!!selectedOrder.paymentAudit?.length && (
                    <div className="payment-audit">
                      <b>Histórico e auditoria</b>
                      {selectedOrder.paymentAudit.map((entry, index) => (
                        <span key={index}>
                          <small>
                            {entry.date} • {entry.user}
                          </small>
                          {entry.action}
                          {entry.note ? ` — ${entry.note}` : ""}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="pdf-actions">
                    {documentType(selectedOrder) === "Orçamento" && (
                      <button
                        className="approve-button"
                        onClick={() => approveQuote(selectedOrder)}
                      >
                        ✓ Aprovar orçamento
                      </button>
                    )}
                    <button onClick={() => sendOrderWhatsApp(selectedOrder)}>
                      WhatsApp
                    </button>
                    <button onClick={() => makePdf(selectedOrder, "download")}>
                      ↓ Criar PDF
                    </button>
                    <button
                      className="primary"
                      onClick={() => makePdf(selectedOrder, "share")}
                    >
                      ↗ Enviar pedido
                    </button>
                  </div>
                </>
              )
            )}
          </section>
        </div>
      )}

      {modal && (
        <div className="modal-backdrop" onMouseDown={() => setModal(null)}>
          <section
            className={`modal ${modal === "details" ? "details-modal" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button
              className="close"
              onClick={() => setModal(null)}
              aria-label="Fechar"
            >
              ×
            </button>
            <span className="modal-icon">
              {modal === "stock"
                ? "↕"
                : modal === "details"
                  ? selected?.emoji
                  : "✦"}
            </span>
            <h2 id="modal-title">
              {modal === "new"
                ? "Novo produto"
                : modal === "edit"
                  ? "Editar produto"
                  : modal === "stock"
                    ? "Ajustar estoque"
                    : "Detalhes do produto"}
            </h2>
            {modal === "details" && selected ? (
              <div className="details-content">
                {selected.images.length > 0 && (
                  <div className="product-carousel">
                    <div className="carousel-stage">
                      <img
                        src={selected.images[carouselIndex]}
                        alt={`${selected.name} — foto ${carouselIndex + 1}`}
                      />
                      {selected.images.length > 1 && (
                        <>
                          <button
                            className="carousel-prev"
                            onClick={() =>
                              setCarouselIndex(
                                (carouselIndex - 1 + selected.images.length) %
                                  selected.images.length,
                              )
                            }
                            aria-label="Foto anterior"
                          >
                            ‹
                          </button>
                          <button
                            className="carousel-next"
                            onClick={() =>
                              setCarouselIndex(
                                (carouselIndex + 1) % selected.images.length,
                              )
                            }
                            aria-label="Próxima foto"
                          >
                            ›
                          </button>
                          <span>
                            {carouselIndex + 1} / {selected.images.length}
                          </span>
                        </>
                      )}
                    </div>
                    {selected.images.length > 1 && (
                      <div className="carousel-thumbs">
                        {selected.images.map((image, i) => (
                          <button
                            type="button"
                            key={image}
                            className={i === carouselIndex ? "selected" : ""}
                            onClick={() => setCarouselIndex(i)}
                          >
                            <img src={image} alt={`Miniatura ${i + 1}`} />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <div className="detail-summary">
                  <div>
                    <small>ESTOQUE TOTAL</small>
                    <strong>{selected.stock} un.</strong>
                  </div>
                  <div>
                    <small>VAREJO</small>
                    <strong>
                      R$ {selected.retailPrice.toFixed(2).replace(".", ",")}
                    </strong>
                  </div>
                  <div>
                    <small>ATACADO</small>
                    <strong>
                      R$ {selected.wholesalePrice.toFixed(2).replace(".", ",")}
                    </strong>
                  </div>
                </div>
                <h3>{selected.name}</h3>
                <p>
                  {selected.code} • {selected.category} • Atacado a partir de{" "}
                  {selected.wholesaleMin} unidades
                </p>
                <h4>Variações cadastradas</h4>
                <div className="variation-list">
                  {selected.variations.map((v, i) => (
                    <div key={v}>
                      <span>{i + 1}</span>
                      <b>{v}</b>
                      <em>
                        {Math.floor(
                          selected.stock / selected.variations.length,
                        )}{" "}
                        un.
                      </em>
                    </div>
                  ))}
                </div>
                <div className="modal-actions">
                  <button onClick={() => openModal("stock", selected)}>
                    Ajustar estoque
                  </button>
                  <button
                    className="primary"
                    onClick={() => openModal("edit", selected)}
                  >
                    Editar produto
                  </button>
                </div>
              </div>
            ) : modal === "stock" && selected ? (
              <form onSubmit={adjustStock}>
                <p>
                  Saldo atual de <b>{selected.name}</b>:{" "}
                  <strong>{selected.stock} unidades</strong>.
                </p>
                <label>
                  Tipo de movimentação
                  <select name="operation">
                    <option value="entrada">Entrada — somar ao estoque</option>
                    <option value="saida">Saída — retirar do estoque</option>
                  </select>
                </label>
                <label>
                  Quantidade
                  <input
                    name="amount"
                    required
                    type="number"
                    min="1"
                    defaultValue="1"
                    autoFocus
                  />
                </label>
                <label>
                  Observação
                  <input name="note" placeholder="Ex.: Compra de fornecedor" />
                </label>
                <div className="modal-actions">
                  <button type="button" onClick={() => setModal(null)}>
                    Cancelar
                  </button>
                  <button className="primary" type="submit">
                    Confirmar movimentação
                  </button>
                </div>
              </form>
            ) : (
              <>
                <p>
                  {modal === "edit"
                    ? "Atualize os dados, preços e variações do produto."
                    : "Cadastre o produto com preços de varejo, atacado e variações."}
                </p>
                <form onSubmit={saveProduct}>
                  <label>
                    Nome do produto
                    <input
                      name="name"
                      required
                      defaultValue={selected?.name}
                      placeholder="Ex.: Caneca mágica"
                      autoFocus
                    />
                  </label>
                  <div className="form-row">
                    <label>
                      Categoria
                      <input
                        name="category"
                        required
                        defaultValue={selected?.category}
                        placeholder="Canecas"
                      />
                    </label>
                    <label>
                      Quantidade em estoque
                      <input
                        name="stock"
                        required
                        type="number"
                        min="0"
                        defaultValue={selected?.stock ?? 10}
                      />
                    </label>
                  </div>
                  <div className="form-row triple">
                    <label>
                      Valor varejo (R$)
                      <input
                        name="retailPrice"
                        required
                        type="number"
                        min="0"
                        step="0.01"
                        defaultValue={selected?.retailPrice}
                      />
                    </label>
                    <label>
                      Valor atacado (R$)
                      <input
                        name="wholesalePrice"
                        required
                        type="number"
                        min="0"
                        step="0.01"
                        defaultValue={selected?.wholesalePrice}
                      />
                    </label>
                    <label>
                      Mínimo atacado
                      <input
                        name="wholesaleMin"
                        required
                        type="number"
                        min="1"
                        defaultValue={selected?.wholesaleMin ?? 10}
                      />
                    </label>
                  </div>
                  <div className="form-row">
                    <label>
                      Estoque mínimo
                      <input
                        name="minStock"
                        required
                        type="number"
                        min="0"
                        defaultValue={selected?.minStock ?? 5}
                      />
                    </label>
                    <label>
                      Unidade de medida
                      <input value="Unidade (un.)" readOnly />
                    </label>
                  </div>
                  <label>
                    Variações{" "}
                    <small>
                      Uma por linha: cor • tamanho • modelo • material
                    </small>
                    <textarea
                      name="variations"
                      rows={5}
                      defaultValue={selected?.variations.join("\n")}
                      placeholder={
                        "Branca • 325 ml • Cerâmica\nPreta • 325 ml • Cerâmica"
                      }
                    />
                  </label>
                  <label className="image-upload">
                    <span>
                      Fotos do produto <small>Opcional</small>
                    </span>
                    <input
                      name="images"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      multiple
                    />
                    <b>＋ Escolher uma ou várias imagens</b>
                    <em>
                      A primeira foto será a capa. As demais formarão o
                      carrossel.
                    </em>
                    {selected?.images.length ? (
                      <small>
                        {selected.images.length} foto(s) já cadastrada(s)
                      </small>
                    ) : null}
                  </label>
                  <div className="modal-actions">
                    <button type="button" onClick={() => setModal(null)}>
                      Cancelar
                    </button>
                    <button className="primary" type="submit">
                      {modal === "edit"
                        ? "Salvar alterações"
                        : "Cadastrar produto"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </section>
        </div>
      )}
      {personModal && (
        <div
          className="modal-backdrop"
          onMouseDown={() => setPersonModal(null)}
        >
          <section
            className="modal person-modal"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setPersonModal(null)}
            >
              ×
            </button>
            {personModal === "type" ? (
              <div className="person-type-picker">
                <small>NOVO CADASTRO</small>
                <h2>Qual é o tipo de pessoa?</h2>
                <p>
                  O cadastro será único e poderá receber outras classificações
                  depois.
                </p>
                <div>
                  {(
                    [
                      "Cliente",
                      "Fornecedor",
                      "Funcionário",
                      "Outro",
                    ] as PersonKind[]
                  ).map((kind, i) => (
                    <button
                      key={kind}
                      onClick={() => {
                        setNewPersonType(kind);
                        setPersonModal("form");
                      }}
                    >
                      <i>{["♙", "▣", "♟", "◇"][i]}</i>
                      <span>
                        <b>{kind}</b>
                        <small>
                          {
                            [
                              "Compras, pedidos e relacionamento",
                              "Compras, estoque e contas a pagar",
                              "Produção, tarefas e eventos",
                              "Parceiros, leads e contatos",
                            ][i]
                          }
                        </small>
                      </span>
                      <em>›</em>
                    </button>
                  ))}
                </div>
              </div>
            ) : personModal === "form" ? (
              <form
                className="person-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  const data = new FormData(e.currentTarget);
                  const document = String(data.get("document") || "").trim();
                  const phone = String(data.get("phone") || "").trim();
                  const email = String(data.get("email") || "").trim();
                  const duplicate = people.find(
                    (p) =>
                      (document && p.document === document) ||
                      (phone && p.phone === phone) ||
                      (email && p.email === email),
                  );
                  if (
                    duplicate &&
                    !window.confirm(
                      `Encontramos ${duplicate.name}, que pode já estar cadastrado. Deseja continuar com um novo cadastro?`,
                    )
                  ) {
                    setSelectedPerson(duplicate);
                    setPersonModal("profile");
                    return;
                  }
                  const id = Date.now();
                  const person: Person = {
                    id,
                    code: `PES-${String(id).slice(-5)}`,
                    types: [newPersonType],
                    name: String(data.get("name")),
                    fantasyName: String(data.get("fantasyName") || ""),
                    document,
                    phone,
                    whatsapp: String(data.get("whatsapp") || phone),
                    email,
                    city: String(data.get("city") || ""),
                    company: String(data.get("company") || ""),
                    role: String(data.get("role") || ""),
                    tags: String(data.get("tags") || "")
                      .split(",")
                      .map((v) => v.trim())
                      .filter(Boolean),
                    notes: String(data.get("notes") || ""),
                    status: String(data.get("status")) as Person["status"],
                    createdAt: new Date().toLocaleDateString("pt-BR"),
                    orderCount: 0,
                  };
                  setPeople((current) => [person, ...current]);
                  if (newPersonType === "Cliente")
                    setCustomers((current) => [
                      {
                        id,
                        name: person.name,
                        phone: person.phone,
                        email: person.email,
                        city: person.city,
                        notes: person.notes,
                        createdAt: person.createdAt,
                        orderCount: 0,
                      },
                      ...current,
                    ]);
                  registerAudit(
                    "Pessoa cadastrada",
                    "Pessoas",
                    `${person.code} • ${person.name} • ${newPersonType}`,
                  );
                  setPeopleTab(newPersonType);
                  setPersonModal(null);
                  notify("Pessoa cadastrada com sucesso.");
                }}
              >
                <small>PESSOAS → NOVO CADASTRO</small>
                <h2>Novo {newPersonType.toLowerCase()}</h2>
                <p>
                  Código único, controle de duplicidade e dados preservados.
                </p>
                <div className="form-row">
                  <label>
                    Nome completo ou razão social
                    <input required name="name" autoFocus />
                  </label>
                  <label>
                    Nome fantasia
                    <input name="fantasyName" />
                  </label>
                </div>
                <div className="form-row">
                  <label>
                    CPF ou CNPJ
                    <input name="document" />
                  </label>
                  <label>
                    Telefone
                    <input required name="phone" />
                  </label>
                </div>
                <div className="form-row">
                  <label>
                    WhatsApp
                    <input name="whatsapp" />
                  </label>
                  <label>
                    E-mail
                    <input name="email" type="email" />
                  </label>
                </div>
                <div className="form-row">
                  <label>
                    Cidade
                    <input name="city" />
                  </label>
                  <label>
                    {newPersonType === "Funcionário"
                      ? "Cargo"
                      : "Empresa / responsável"}
                    <input
                      name={
                        newPersonType === "Funcionário" ? "role" : "company"
                      }
                    />
                  </label>
                </div>
                <div className="form-row">
                  <label>
                    Tags
                    <input name="tags" placeholder="Ex.: VIP, atacado" />
                  </label>
                  <label>
                    Status
                    <select name="status">
                      <option>Ativo</option>
                      <option>Inativo</option>
                      <option>Com pendência</option>
                    </select>
                  </label>
                </div>
                <label>
                  Observações
                  <textarea name="notes" rows={3} />
                </label>
                <div className="modal-actions">
                  <button type="button" onClick={() => setPersonModal("type")}>
                    Voltar
                  </button>
                  <button className="primary" type="submit">
                    Salvar pessoa
                  </button>
                </div>
              </form>
            ) : (
              selectedPerson && (
                <div className="person-profile">
                  <header>
                    <i>{selectedPerson.name.slice(0, 2).toUpperCase()}</i>
                    <div>
                      <small>PERFIL DA PESSOA • {selectedPerson.code}</small>
                      <h2>{selectedPerson.name}</h2>
                      <p>
                        {selectedPerson.types.join(" + ")} •{" "}
                        {selectedPerson.city || "Cidade não informada"}
                      </p>
                    </div>
                    <em>{selectedPerson.status}</em>
                  </header>
                  <div className="profile-actions">
                    <button
                      onClick={() => notify("Cadastro pronto para edição.")}
                    >
                      ✎ Editar
                    </button>
                    <a
                      href={`https://wa.me/55${(selectedPerson.whatsapp || selectedPerson.phone).replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      ◉ WhatsApp
                    </a>
                    <button
                      onClick={() => {
                        setActiveNav("Pedidos");
                        setOrderModal("new");
                        setPersonModal(null);
                      }}
                    >
                      ＋ Pedido
                    </button>
                    <button onClick={() => notify("Área de anexos aberta.")}>
                      ⌁ Anexar
                    </button>
                  </div>
                  <nav className="profile-tabs">
                    <button className="active">Visão geral</button>
                    <button>Pedidos</button>
                    <button>Financeiro</button>
                    <button>Arquivos</button>
                    <button>Histórico</button>
                  </nav>
                  <section className="profile-grid">
                    <article>
                      <small>DADOS DE CONTATO</small>
                      <b>{selectedPerson.phone || "Não informado"}</b>
                      <span>
                        {selectedPerson.email || "E-mail não informado"}
                      </span>
                      <span>
                        {selectedPerson.city || "Cidade não informada"}
                      </span>
                    </article>
                    <article>
                      <small>CLASSIFICAÇÕES</small>
                      <div>
                        {selectedPerson.types.map((type) => (
                          <b key={type}>{type}</b>
                        ))}
                      </div>
                      <button
                        onClick={() => {
                          const available = (
                            [
                              "Cliente",
                              "Fornecedor",
                              "Funcionário",
                              "Outro",
                            ] as PersonKind[]
                          ).find((t) => !selectedPerson.types.includes(t));
                          if (!available)
                            return notify(
                              "Todas as classificações já estão vinculadas.",
                            );
                          const updated = {
                            ...selectedPerson,
                            types: [...selectedPerson.types, available],
                          };
                          setPeople((current) =>
                            current.map((p) =>
                              p.id === updated.id ? updated : p,
                            ),
                          );
                          setSelectedPerson(updated);
                          notify(
                            `${available} adicionado sem duplicar o cadastro.`,
                          );
                        }}
                      >
                        ＋ Adicionar classificação
                      </button>
                    </article>
                    <article>
                      <small>RELACIONAMENTO</small>
                      <b>{selectedPerson.orderCount} pedido(s)</b>
                      <span>Histórico e vínculos preservados</span>
                      <span>{selectedPerson.notes || "Sem observações"}</span>
                    </article>
                    <article>
                      <small>AÇÕES RÁPIDAS</small>
                      <button
                        onClick={() =>
                          notify("Orçamento iniciado para esta pessoa.")
                        }
                      >
                        Criar orçamento
                      </button>
                      <button
                        onClick={() =>
                          notify("Lançamento financeiro iniciado.")
                        }
                      >
                        Lançamento financeiro
                      </button>
                      <button
                        onClick={() =>
                          notify("Observação pronta para inclusão.")
                        }
                      >
                        Adicionar observação
                      </button>
                    </article>
                  </section>
                </div>
              )
            )}
          </section>
        </div>
      )}
      {personModal === "profile" && selectedPerson && (
        <aside className="person-files-panel">
          <header>
            <div>
              <small>ARQUIVOS DA PESSOA</small>
              <h3>Anexos para impressão</h3>
            </div>
            <b>{selectedPerson.attachments?.length || 0}</b>
          </header>
          <div className="quality-seal">
            <b>✓ Qualidade original protegida</b>
            <span>
              O sistema não redimensiona, converte nem comprime a imagem. A
              resolução e o arquivo original são preservados para impressão.
            </span>
          </div>
          <label className="original-upload">
            <span>📎 Anexar arquivos</span>
            <input
              type="file"
              multiple
              accept="image/*,.pdf,.svg,.cdr,.ai,.psd,.eps,.tif,.tiff"
              onChange={(e) => {
                attachFilesToPerson(selectedPerson, e.target.files);
                e.currentTarget.value = "";
              }}
            />
            <b>Escolher imagens ou arquivos</b>
            <small>PNG, JPG, TIFF, PDF, SVG, CDR, AI, PSD e EPS.</small>
          </label>
          <div className="attached-files">
            {selectedPerson.attachments?.map((file) => (
              <article key={file.id}>
                <i>{file.type.startsWith("image/") ? "▧" : "▤"}</i>
                <span>
                  <b>{file.name}</b>
                  <small>
                    {(file.size / 1024 / 1024).toFixed(2)} MB • Original •{" "}
                    {file.uploadedAt}
                  </small>
                </span>
                <a href={file.dataUrl} download={file.name}>
                  Baixar original
                </a>
              </article>
            ))}
            {!selectedPerson.attachments?.length && (
              <p>Nenhum arquivo anexado ainda.</p>
            )}
          </div>
        </aside>
      )}
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </main>
  );
}
