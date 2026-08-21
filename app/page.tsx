"use client";

import { useEffect, useMemo, useState } from "react";

type Product = { product_id:string; sku:string; manufacturer:string; catalog_section_source:string; product_name_source:string; product_name_search:string; technical_specifications:string; specification_status:string; source_pdf:string; source_pdf_page:number; image_file:string; model_number?:string; short_description?:string; detailed_description?:string; source_url?:string; };
const ASSET_BASE=typeof window!=="undefined"&&window.location.hostname.endsWith("github.io")?"/medical-equipment-dashboard":"";
const companyProfiles:Record<string,{shortName:string;description:string;address:string;phone:string;email:string}>={
 "Hosmed Healthcare Industries Pvt. Ltd.":{
  shortName:"Hosmed Healthcare",
  description:"Manufacturer & Exporter of Hospital Furniture & Equipments",
  address:"No.-9 Choudhary Compound, Sector-D, Sanwer Road, Khatipura, Indore (M.P.) - 452007",
  phone:"+91 97990 76498",
  email:"hosmedindustries@gmail.com"
 },
 "Shri Baba Surgical Company":{
  shortName:"Shri Baba Surgical Company",
  description:"Manufacturers, Traders & Exporters of Hospital Furniture, Surgical Instruments, O.T. Equipment and Medical Equipment",
  address:"Near Patch Wale Hanuman Mandir, Jail Road, Dholpur (Rajasthan) - 328001",
  phone:"+91 9649905550, 6264209870",
  email:"shribabasurgicalcompany@gmail.com"
 },
 "Medichem Electronics Pvt. Ltd.":{
  shortName:"Medichem Electronics",
  description:"Indian manufacturer of MEDILAP electrosurgical, neonatal care, operation theatre and physiotherapy equipment, with more than 30 years of experience.",
  address:"Site 1: B-60, Sector-64, Electronic City, Noida, Uttar Pradesh. Site 2: Plot No. 191, Udyog Kendra 2, Ecotech 3, Greater Noida, Uttar Pradesh.",
  phone:"0120-4334621",
  email:"infodesk@medichemelectronic.com"
 }
};

function ProductCard({product,image,onMoreInfo}:{product:Product;image?:string;onMoreInfo:(product:Product)=>void}){
 return <article className="product-card">
  <div className="image-box">
   {image?<img src={image} alt={product.product_name_search}/>:<div className="image-empty" aria-hidden="true"><span>＋</span><p>No image uploaded</p></div>}
  </div>
  <div className="card-body"><div className="card-meta"><span>{product.sku}</span></div><h2>{product.product_name_search}</h2><p className="manufacturer">{product.manufacturer}</p><dl>{product.model_number&&<div><dt>Model</dt><dd>{product.model_number}</dd></div>}<div><dt>Category</dt><dd>{product.catalog_section_source}</dd></div><div><dt>Description</dt><dd>{product.short_description||product.product_name_source}</dd></div><div><dt>Specifications</dt><dd>{product.specification_status==="available"?"Available in product details":"N/A"}</dd></div></dl>{product.detailed_description&&<button type="button" className="more-info-button" onClick={()=>onMoreInfo(product)}>More info <span>→</span></button>}</div>
 </article>
}

function ProductDetail({product,image,onBack}:{product:Product;image?:string;onBack:()=>void}){
 return <section className="product-detail"><button type="button" className="detail-back" onClick={onBack}>← Back to catalog</button><div className="detail-layout"><div className="detail-image">{image?<img src={image} alt={product.product_name_search}/>:<div className="image-empty"><span>＋</span><p>No image uploaded</p></div>}</div><article className="detail-content"><p className="eyebrow">{product.catalog_section_source}</p><h1>{product.product_name_search}</h1><p className="detail-company">{product.manufacturer}</p><div className="detail-facts"><div><span>Model</span><strong>{product.model_number||product.sku||"N/A"}</strong></div><div><span>Product code</span><strong>{product.sku}</strong></div></div><h2>Overview</h2><p className="detail-summary">{product.short_description||product.product_name_source}</p><h2>Complete product information</h2><div className="detail-text">{product.detailed_description||product.technical_specifications||"N/A"}</div>{product.source_pdf_page>0&&<p className="catalogue-source">Catalogue reference: {product.source_pdf} · Page {product.source_pdf_page}</p>}{product.source_url&&<a className="source-link" href={product.source_url} target="_blank" rel="noreferrer">View official product source ↗</a>}</article></div></section>
}

export default function Home(){
 const [products,setProducts]=useState<Product[]>([]),[query,setQuery]=useState(""),[company,setCompany]=useState("All companies"),[panelOpen,setPanelOpen]=useState(false),[selectedProduct,setSelectedProduct]=useState<Product|null>(null),[loading,setLoading]=useState(true);
 useEffect(()=>{fetch(`${ASSET_BASE}/data/products.json`).then(r=>r.json()).then((catalog:Product[])=>{setProducts(catalog);setLoading(false)})},[]);
 const companies=useMemo(()=>Array.from(new Set(products.map(p=>p.manufacturer))),[products]);
 const filtered=useMemo(()=>{const terms=query.toLowerCase().trim().split(/\s+/).filter(Boolean);return products.filter(p=>{if(company!=="All companies"&&p.manufacturer!==company)return false;const searchable=[p.sku,p.model_number,p.product_name_search,p.product_name_source,p.short_description,p.catalog_section_source,p.manufacturer,p.technical_specifications].join(" ").toLowerCase();return terms.every(term=>searchable.includes(term))})},[products,query,company]);
 if(selectedProduct){const filename=selectedProduct.image_file.split("/").pop();const image=filename?`${ASSET_BASE}/product-images/${filename}`:undefined;return <main><ProductDetail product={selectedProduct} image={image} onBack={()=>setSelectedProduct(null)}/></main>}
 return <main>
  <section className="hero"><div className="brand"><span className="brand-mark">M</span><span>Medical Equipment Directory</span></div><div className="hero-copy"><p className="eyebrow">SEARCH THE CATALOG</p><h1>Find the right medical equipment.</h1><div className="search-shell"><span className="search-icon">⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search beds, trolleys, lights, wheelchairs…" aria-label="Search medical equipment" autoFocus/>{query&&<button type="button" onClick={()=>setQuery("")} aria-label="Clear search">×</button>}</div><div className="companies" aria-label="Company filter"><span>Companies</span><button type="button" className={company==="All companies"?"active":""} onClick={()=>{setCompany("All companies");setPanelOpen(false)}}>All</button>{companies.map(name=><button type="button" key={name} className={company===name?"active":""} onClick={()=>{setCompany(name);setPanelOpen(true)}}>{name}</button>)}</div></div></section>
  <section className="catalog" aria-live="polite"><div className="catalog-heading"><div><p className="eyebrow">PRODUCT CATALOG</p><h2>{query?`Results for “${query}”`:"All equipment"}</h2></div><p>{loading?"Loading catalog…":`${filtered.length} item${filtered.length===1?"":"s"}`}</p></div>{!loading&&filtered.length===0?<div className="empty-results"><h2>No equipment found</h2><p>Try a product code, category, or a simpler search term.</p><button type="button" onClick={()=>setQuery("")}>Clear search</button></div>:<div className="product-grid">{filtered.map(product=>{const filename=product.image_file.split("/").pop();const image=filename?`${ASSET_BASE}/product-images/${filename}`:undefined;return <ProductCard key={product.product_id} product={product} image={image} onMoreInfo={setSelectedProduct}/>})}</div>}</section>
  {company!=="All companies"&&!panelOpen&&companyProfiles[company]&&<button type="button" className="panel-reopen" onClick={()=>setPanelOpen(true)} aria-label={`Open ${company} information`}><span>‹</span><small>Company info</small></button>}
  {company!=="All companies"&&panelOpen&&companyProfiles[company]&&<><button type="button" className="panel-backdrop" onClick={()=>setPanelOpen(false)} aria-label="Close company information"/><aside className="company-panel" aria-label={`${company} information`}><div className="panel-top"><span className="panel-logo">{companyProfiles[company].shortName.charAt(0)}</span><button type="button" className="panel-close" onClick={()=>setPanelOpen(false)} aria-label="Close company information">×</button></div><p className="eyebrow">COMPANY PROFILE</p><h2>{companyProfiles[company].shortName}</h2><p className="company-description">{companyProfiles[company].description}</p><div className="company-stat"><strong>{products.filter(product=>product.manufacturer===company).length}</strong><span>catalog products</span></div><dl className="company-details"><div><dt>Registered address</dt><dd>{companyProfiles[company].address}</dd></div><div><dt>Phone</dt><dd>{companyProfiles[company].phone}</dd></div><div><dt>Email</dt><dd><a href={`mailto:${companyProfiles[company].email}`}>{companyProfiles[company].email}</a></dd></div><div><dt>Source</dt><dd>{company==="Medichem Electronics Pvt. Ltd."?"Official company website":"Company catalog cover pages"}</dd></div></dl><p className="panel-note">Company information is transcribed from the supplied source. Verify contact details before external use.</p></aside></>}
 </main>
}
