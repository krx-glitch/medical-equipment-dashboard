"use client";

import { useEffect, useMemo, useState } from "react";

type Product = { product_id:string; sku:string; manufacturer:string; catalog_section_source:string; product_name_source:string; product_name_search:string; technical_specifications:string; specification_status:string; source_pdf:string; source_pdf_page:number; image_file:string; image_files?:string[]; model_number?:string; short_description?:string; detailed_description?:string; };
type CompanyType="Medical Furniture"|"Medical Equipment";
const ASSET_BASE=typeof window!=="undefined"&&window.location.hostname.endsWith("github.io")?"/medical-equipment-dashboard":"";
const IMAGE_VERSION="20260825-syris-recrops-v2";
const companyProfiles:Record<string,{shortName:string;companyType:CompanyType;description:string;address:string;phone:string;email:string}>={
 "Hosmed Healthcare Industries Pvt. Ltd.":{
  shortName:"Hosmed Healthcare",
  companyType:"Medical Furniture",
  description:"Manufacturer & Exporter of Hospital Furniture & Equipments",
  address:"No.-9 Choudhary Compound, Sector-D, Sanwer Road, Khatipura, Indore (M.P.) - 452007",
  phone:"+91 97990 76498",
  email:"hosmedindustries@gmail.com"
 },
 "Shri Baba Surgical Company":{
  shortName:"Shri Baba Surgical Company",
  companyType:"Medical Furniture",
  description:"Manufacturers, Traders & Exporters of Hospital Furniture, Surgical Instruments, O.T. Equipment and Medical Equipment",
  address:"Near Patch Wale Hanuman Mandir, Jail Road, Dholpur (Rajasthan) - 328001",
  phone:"+91 9649905550, 6264209870",
  email:"shribabasurgicalcompany@gmail.com"
 },
 "Medichem Electronics Pvt. Ltd.":{
  shortName:"Medichem Electronics",
  companyType:"Medical Equipment",
  description:"Indian manufacturer of MEDILAP electrosurgical, neonatal care, operation theatre and physiotherapy equipment, with more than 30 years of experience.",
  address:"Site 1: B-60, Sector-64, Electronic City, Noida, Uttar Pradesh. Site 2: Plot No. 191, Udyog Kendra 2, Ecotech 3, Greater Noida, Uttar Pradesh.",
  phone:"0120-4334621",
  email:"infodesk@medichemelectronic.com"
 },
 "AKAS Medical Equipment":{
  shortName:"AKAS Infusions",
  companyType:"Medical Equipment",
  description:"ISO-certified Indian critical-care equipment manufacturer founded in 1996, specialising in syringe pumps, volumetric infusion pumps, fluid management and related ICU devices. The company reports exports to more than 15 countries and over 50,000 installed products.",
  address:"Corporate Office: Plot No. SP127, Sector-1, 5th Lane, 1st Main Road, South SIDCO-N, Ambattur Industrial Estate, Chennai - 600058. Factory: 26, Palayam Bazar Road, Worayur, Tiruchirapalli - 620003.",
  phone:"+91 98403 79116",
  email:"sales@akasinfusions.com"
 },
 "Omega Surgical Industries":{
  shortName:"Omega Surgical Industries",
  companyType:"Medical Equipment",
  description:"Delhi-based manufacturer of operating tables, surgical lights, hospital furniture and patient-mobility equipment. CareMob (also styled Mob Care) is presented in the supplied catalogue as Omega's patient-mobility product division.",
  address:"Plot No. 104, KH No. 13/3/2, Nangli Sakrawati Extension, Najafgarh, Delhi - 110043",
  phone:"+91 7838650228, +91 7838764323",
  email:"N/A"
 },
 "Royal International (Alis Pro)":{
  shortName:"Royal International (Alis Pro)",
  companyType:"Medical Equipment",
  description:"Healthcare supplier and hospital-furniture manufacturer serving hospitals, clinics and healthcare institutions. Its catalogue also covers medical equipment, surgical instruments, diagnostics, consumables and complete OT setup solutions.",
  address:"Corporate Office: 238, Westend Mall, Janakpuri West, Delhi - 110058. Manufacturing Unit: 115-A, Waryana Industrial Complex, near Leather Complex, Jalandhar, Punjab - 144021.",
  phone:"+91 98788 62255, +91 73031 53195, +91 73031 52840",
  email:"domestic@alisprofessional.com"
 },
 "Mekosha Healthcare Pvt. Ltd.":{
  shortName:"Mekosha Healthcare",
  companyType:"Medical Equipment",
  description:"Ahmedabad-based radiology technology company providing digital radiography detectors, imaging software, detector safety systems and medical printing solutions.",
  address:"A-406, PNTC, Radio Mirchi Road, Vejalpur, Ahmedabad - 380015, Gujarat, India",
  phone:"+91 9327768701",
  email:"info@mekoshahealthcare.com"
 },
 "Devay Medical Technologies":{
  shortName:"Devay Medical Technologies",
  companyType:"Medical Equipment",
  description:"Vadodara-based medical technology manufacturer founded in 2005, specialising in syringe infusion pumps, docking solutions and neonatal LED phototherapy systems.",
  address:"Registered Office: 427, 4th Floor, Siddharth Annexe-2, Sama-Savli Main Road, Vadodara - 390008. Factory: 62-63, Kanha Industrial Estate, Savli-Manjusar Road, Vadodara - 391775, Gujarat.",
  phone:"+91 98242 51515",
  email:"devay.devay@gmail.com"
 },
 "Zohra Surgical Enterprises":{
  shortName:"Zohra Surgical Enterprises",
  companyType:"Medical Equipment",
  description:"Indian medical and surgical equipment manufacturer established in 1991. Its catalogue covers sterilization, CSSD, suction, hospital furniture, operation theatre, ICU, NICU, laboratory and general hospital equipment.",
  address:"N/A",
  phone:"N/A",
  email:"N/A"
 },
 "Neonest Medical Systems":{
  shortName:"Neonest",
  companyType:"Medical Equipment",
  description:"Manufacturer of neonatal intensive-care equipment, including radiant warmers, open-care systems, resuscitation units, incubators, phototherapy systems and baby trolleys.",
  address:"N/A",
  phone:"N/A",
  email:"N/A"
 },
 "VDS Medical Systems Pvt. Ltd.":{
  shortName:"VDS Medical Systems",
  companyType:"Medical Furniture",
  description:"Manufacturer of hospital beds, ward and operation-theatre furniture, examination and delivery tables, trolleys, bedside furniture and general hospital equipment.",
  address:"Plant: Plot No. D-7, 8, 9, Industrial Area, Gopalpur, Sikandarabad, Bulandshahar - 203205. Branch: S.S.B. Complex, Plot No. C-2, Kanpur Road Yojana, Sector-L, Ashiyana, Lucknow - 226012.",
  phone:"8882212171, 8860616207/08/09",
  email:"info@vdsmedicalsystems.com"
 },
 "Syris Biotech Private Limited":{
  shortName:"Syris Biotech",
  companyType:"Medical Equipment",
  description:"Medical-equipment and diagnostic-products company covering patient monitoring, ECG, respiratory care, defibrillation, clinical chemistry, electrolyte, coagulation, immunoassay, haematology and rapid-testing products.",
  address:"221, 2nd Floor, Ocus Quantum, Sector-51, Gurugram - 122018",
  phone:"0124-4777578, +91 99587 95369",
  email:"info@syrisbiotech.com"
 }
};

function ImageGallery({images,alt,className}:{images:string[];alt:string;className:string}){
 const [index,setIndex]=useState(0);
 useEffect(()=>setIndex(0),[images.join("|")]);
 if(!images.length)return <div className={`${className} image-empty`}><span>＋</span><p>No image uploaded</p></div>;
 return <div className={`${className} image-gallery`}><img src={images[index]} alt={`${alt}${images.length>1?` — image ${index+1} of ${images.length}`:""}`}/>{images.length>1&&<><button type="button" className="gallery-arrow gallery-prev" onClick={()=>setIndex(value=>(value-1+images.length)%images.length)} aria-label="Previous product image">‹</button><button type="button" className="gallery-arrow gallery-next" onClick={()=>setIndex(value=>(value+1)%images.length)} aria-label="Next product image">›</button><span className="gallery-count">{index+1} / {images.length}</span></>}</div>
}

function ProductCard({product,images,onMoreInfo}:{product:Product;images:string[];onMoreInfo:(product:Product)=>void}){
 return <article className="product-card">
  <div className="image-box">
   <ImageGallery images={images} alt={product.product_name_search} className="card-gallery"/>
  </div>
  <div className="card-body"><div className="card-meta"><span>{product.sku}</span></div><h2>{product.product_name_search}</h2><p className="manufacturer">{product.manufacturer}</p><dl>{product.model_number&&<div><dt>Model</dt><dd>{product.model_number}</dd></div>}<div><dt>Category</dt><dd>{product.catalog_section_source}</dd></div><div><dt>Description</dt><dd>{product.short_description||product.product_name_source}</dd></div><div><dt>Specifications</dt><dd>{product.specification_status==="available"?"Available in product details":"N/A"}</dd></div></dl>{product.detailed_description&&<button type="button" className="more-info-button" onClick={()=>onMoreInfo(product)}>More info <span>→</span></button>}</div>
 </article>
}

function ProductDetail({product,images,onBack}:{product:Product;images:string[];onBack:()=>void}){
 return <section className="product-detail"><button type="button" className="detail-back" onClick={onBack}>← Back to catalog</button><div className="detail-layout"><div className="detail-image"><ImageGallery images={images} alt={product.product_name_search} className="detail-gallery"/></div><article className="detail-content"><p className="eyebrow">{product.catalog_section_source}</p><h1>{product.product_name_search}</h1><p className="detail-company">{product.manufacturer}</p><div className="detail-facts"><div><span>Model</span><strong>{product.model_number||product.sku||"N/A"}</strong></div><div><span>Product code</span><strong>{product.sku}</strong></div></div><h2>Overview</h2><p className="detail-summary">{product.short_description||product.product_name_source}</p><h2>Complete product information</h2><div className="detail-text">{product.detailed_description||product.technical_specifications||"N/A"}</div>{product.source_pdf_page>0&&<p className="catalogue-source">Catalogue reference: {product.source_pdf} · Page {product.source_pdf_page}</p>}</article></div></section>
}

export default function Home(){
 const [products,setProducts]=useState<Product[]>([]),[query,setQuery]=useState(""),[companyType,setCompanyType]=useState<"All"|CompanyType>("All"),[company,setCompany]=useState("All companies"),[panelOpen,setPanelOpen]=useState(false),[selectedProduct,setSelectedProduct]=useState<Product|null>(null),[loading,setLoading]=useState(true);
 useEffect(()=>{fetch(`${ASSET_BASE}/data/products.json`).then(r=>r.json()).then((catalog:Product[])=>{setProducts(catalog);setLoading(false)})},[]);
 const companies=useMemo(()=>Array.from(new Set(products.map(p=>p.manufacturer))).filter(name=>companyType==="All"||companyProfiles[name]?.companyType===companyType),[products,companyType]);
 const filtered=useMemo(()=>{const terms=query.toLowerCase().trim().split(/\s+/).filter(Boolean);return products.filter(p=>{if(companyType!=="All"&&companyProfiles[p.manufacturer]?.companyType!==companyType)return false;if(company!=="All companies"&&p.manufacturer!==company)return false;const searchable=[p.sku,p.model_number,p.product_name_search,p.product_name_source,p.short_description,p.catalog_section_source,p.manufacturer,p.technical_specifications].join(" ").toLowerCase();return terms.every(term=>searchable.includes(term))})},[products,query,company,companyType]);
 const imageUrls=(product:Product)=>(product.image_files?.length?product.image_files:[product.image_file]).map(path=>path?.split("/").pop()).filter(Boolean).map(filename=>`${ASSET_BASE}/product-images/${filename}?v=${IMAGE_VERSION}`);
 if(selectedProduct){return <main><ProductDetail product={selectedProduct} images={imageUrls(selectedProduct)} onBack={()=>setSelectedProduct(null)}/></main>}
 return <main>
  <section className="hero"><div className="brand"><span className="brand-mark">M</span><span>Medical Equipment Directory</span></div><div className="hero-copy"><p className="eyebrow">SEARCH THE CATALOG</p><h1>Find the right medical equipment.</h1><div className="search-shell"><span className="search-icon">⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search beds, trolleys, lights, wheelchairs…" aria-label="Search medical equipment" autoFocus/>{query&&<button type="button" onClick={()=>setQuery("")} aria-label="Clear search">×</button>}</div><div className="company-types" aria-label="Company type filter"><span>Company type</span>{(["All","Medical Furniture","Medical Equipment"] as const).map(type=><button type="button" key={type} className={companyType===type?"active":""} onClick={()=>{setCompanyType(type);setCompany("All companies");setPanelOpen(false)}}>{type}</button>)}</div><div className="companies" aria-label="Company filter"><span>Companies</span><button type="button" className={company==="All companies"?"active":""} onClick={()=>{setCompany("All companies");setPanelOpen(false)}}>All</button>{companies.map(name=><button type="button" key={name} className={company===name?"active":""} onClick={()=>{setCompany(name);setPanelOpen(true)}}>{name}</button>)}</div></div></section>
  <section className="catalog" aria-live="polite"><div className="catalog-heading"><div><p className="eyebrow">PRODUCT CATALOG</p><h2>{query?`Results for “${query}”`:"All equipment"}</h2></div><p>{loading?"Loading catalog…":`${filtered.length} item${filtered.length===1?"":"s"}`}</p></div>{!loading&&filtered.length===0?<div className="empty-results"><h2>No equipment found</h2><p>Try a product code, category, or a simpler search term.</p><button type="button" onClick={()=>setQuery("")}>Clear search</button></div>:<div className="product-grid">{filtered.map(product=><ProductCard key={product.product_id} product={product} images={imageUrls(product)} onMoreInfo={setSelectedProduct}/>)}</div>}</section>
  {company!=="All companies"&&!panelOpen&&companyProfiles[company]&&<button type="button" className="panel-reopen" onClick={()=>setPanelOpen(true)} aria-label={`Open ${company} information`}><span>‹</span><small>Company info</small></button>}
  {company!=="All companies"&&panelOpen&&companyProfiles[company]&&<><button type="button" className="panel-backdrop" onClick={()=>setPanelOpen(false)} aria-label="Close company information"/><aside className="company-panel" aria-label={`${company} information`}><div className="panel-top"><span className="panel-logo">{companyProfiles[company].shortName.charAt(0)}</span><button type="button" className="panel-close" onClick={()=>setPanelOpen(false)} aria-label="Close company information">×</button></div><p className="eyebrow">COMPANY PROFILE</p><h2>{companyProfiles[company].shortName}</h2><p className="company-description">{companyProfiles[company].description}</p><div className="company-stat"><strong>{products.filter(product=>product.manufacturer===company).length}</strong><span>catalog products</span></div><dl className="company-details"><div><dt>Registered address</dt><dd>{companyProfiles[company].address}</dd></div><div><dt>Phone</dt><dd>{companyProfiles[company].phone}</dd></div><div><dt>Email</dt><dd>{companyProfiles[company].email==="N/A"?"N/A":<a href={`mailto:${companyProfiles[company].email}`}>{companyProfiles[company].email}</a>}</dd></div><div><dt>Source</dt><dd>{company==="Medichem Electronics Pvt. Ltd."?"Official company website":company==="AKAS Medical Equipment"||company==="Omega Surgical Industries"?"Official company website and supplied catalogue":"Company catalog cover pages"}</dd></div></dl><p className="panel-note">Company information is transcribed from the supplied source. Verify contact details before external use.</p></aside></>}
 </main>
}
