// PC Zone Store
// غيّر رقم الواتساب هنا إلى رقم المتجر بصيغة دولية بدون + أو مسافات.
const WHATSAPP_NUMBER = "201095605815";

const SUPABASE_URL =
  "https://sbvwosejthyuotcsmvki.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_Qok45Wzs4mVmPwW8jlaxzA_qxuoSWdU";

// المنتجات الافتراضية — أمثلة فقط
const defaultProducts = [
  {
    id: 1,
    name: "HP ZBook Firefly 15 G8",
    category: "laptops",
    price: 28500,
    image: "",
    specs: "Core i7 • RAM 16GB • SSD 256GB • NVIDIA T500 4GB",
    description: "محطة عمل محمولة مناسبة للتصميم والبرمجة والاستخدام الاحترافي.",
    stock: true
  },
  {
    id: 2,
    name: "Dell Precision 5560",
    category: "laptops",
    price: 42000,
    image: "",
    specs: "Core i7 • RAM 32GB • NVMe 1TB • 4K Touch • T1200 4GB",
    description: "أداء احترافي قوي للتصميم والهندسة والمهام الثقيلة.",
    stock: true
  },
  {
    id: 3,
    name: "Gaming PC",
    category: "pcs",
    price: 32000,
    image: "",
    specs: "Gaming Build • SSD NVMe • Dedicated GPU",
    description: "تجميعة Gaming قابلة للتطوير حسب احتياجك.",
    stock: true
  },
  {
    id: 4,
    name: "Laptop Backpack",
    category: "accessories",
    price: 250,
    image: "",
    specs: "خامة قوية • تصميم عملي • مناسبة للابتوب",
    description: "شنطة عملية للاستخدام اليومي والدراسة والشغل.",
    stock: true
  }
];

const categoryNames = {
  laptops: "لابتوبات",
  pcs: "PC & Gaming",
  components: "قطع الكمبيوتر",
  monitors: "الشاشات",
  accessories: "إكسسوارات",
  other: "منتجات أخرى"
};


// ===============================
// Products Storage
// ===============================

function getProducts() {
  const saved = localStorage.getItem("pczone_products");

  if (saved) {
    return JSON.parse(saved);
  }

  return defaultProducts;
}


function saveProducts(products) {
  localStorage.setItem(
    "pczone_products",
    JSON.stringify(products)
  );
}


// ===============================
// Helpers
// ===============================

function money(number) {
  return Number(number).toLocaleString("en-US") + " ج.م";
}


function waLink(product) {

  const message =
`السلام عليكم، أريد الاستفسار عن المنتج: ${product.name}
السعر: ${money(product.price)}
هل المنتج متوفر؟`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}


// ===============================
// Render Products
// ===============================

function render() {

  const searchInput = document.getElementById("search");

  const query = searchInput
    ? searchInput.value.trim().toLowerCase()
    : "";

  let products = getProducts();

  // Search
  products = products.filter(product => {

    const searchableText = `
      ${product.name}
      ${product.specs || ""}
      ${categoryNames[product.category] || ""}
    `.toLowerCase();

    return searchableText.includes(query);
  });


  // Category Filter
  const category = window.activeCategory;

  if (category) {
    products = products.filter(
      product => product.category === category
    );
  }


  // Sorting
  const sort = document.getElementById("sort");

  if (sort) {

    if (sort.value === "low") {

      products.sort(
        (a, b) => a.price - b.price
      );

    }

    if (sort.value === "high") {

      products.sort(
        (a, b) => b.price - a.price
      );

    }
  }


  const grid = document.getElementById("productGrid");

  if (!grid) return;

  grid.innerHTML = "";


  // Empty State
  const empty = document.getElementById("empty");

  if (empty) {
    empty.classList.toggle(
      "hidden",
      products.length !== 0
    );
  }


  // Products
  products.forEach(product => {

    const element = document.createElement("article");

    element.className = "product";


    element.innerHTML = `

      <div class="product-img">

        ${
          product.image
          ?
          `<img 
              src="${product.image}" 
              alt="${product.name}"
           >`
          :
          `<div class="noimg">▦</div>`
        }

        <span class="badge">
          ${
            product.stock
            ? "متوفر"
            : "غير متوفر"
          }
        </span>

      </div>


      <div class="product-body">

        <h3>${product.name}</h3>

        <div class="spec">
          ${product.specs || ""}
        </div>

        <div class="price">
          ${money(product.price)}
        </div>


        <div class="product-actions">

          <button
            class="small-btn"
            onclick="showDetails(${product.id})"
          >
            التفاصيل
          </button>


          <a
            class="small-btn wa"
            target="_blank"
            href="${waLink(product)}"
          >
            WhatsApp
          </a>

        </div>

      </div>

    `;

    grid.appendChild(element);

  });

}


// ===============================
// Product Details Modal
// ===============================

function showDetails(id) {

  const products = getProducts();

  const product = products.find(
    product => product.id === id
  );

  if (!product) return;


  const modalContent =
    document.getElementById("modalContent");


  modalContent.innerHTML = `

    <div class="detail">


      <div class="detail-img">

        ${
          product.image
          ?
          `<img
              src="${product.image}"
              alt="${product.name}"
           >`
          :
          `<div class="noimg">▦</div>`
        }

      </div>


      <div>

        <span class="eyebrow">

          ${
            categoryNames[product.category]
            || "PC ZONE"
          }

        </span>


        <h2>
          ${product.name}
        </h2>


        <div class="price">
          ${money(product.price)}
        </div>


        <p>
          ${product.description || ""}
        </p>


        <ul>

          <li>
            ${product.specs || "تفاصيل المنتج عند التواصل"}
          </li>

          <li>
            ${
              product.stock
              ? "المنتج متوفر حاليًا"
              : "المنتج غير متوفر حاليًا"
            }
          </li>

        </ul>


        <a
          class="btn primary"
          target="_blank"
          href="${waLink(product)}"
        >
          اطلب عبر WhatsApp
        </a>

      </div>


    </div>

  `;


  document
    .getElementById("modal")
    .classList.remove("hidden");

}


// ===============================
// Search
// ===============================

const searchInput =
  document.getElementById("search");

if (searchInput) {

  searchInput.addEventListener(
    "input",
    render
  );

}


// ===============================
// Sorting
// ===============================

const sort =
  document.getElementById("sort");

if (sort) {

  sort.addEventListener(
    "change",
    render
  );

}


// ===============================
// Categories
// ===============================

document
  .querySelectorAll(".category")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        window.activeCategory =
          button.dataset.cat;


        const productsSection =
          document.getElementById("products");


        if (productsSection) {

          productsSection.scrollIntoView({
            behavior: "smooth"
          });

        }


        render();

      }
    );

  });


// ===============================
// Modal
// ===============================

const closeModal =
  document.getElementById("closeModal");

if (closeModal) {

  closeModal.onclick = () => {

    document
      .getElementById("modal")
      .classList.add("hidden");

  };

}


const modal =
  document.getElementById("modal");

if (modal) {

  modal.onclick = event => {

    if (event.target.id === "modal") {

      modal.classList.add("hidden");

    }

  };

}


// ===============================
// WhatsApp Help Button
// ===============================

const helpWhatsapp =
  document.getElementById("helpWhatsapp");

if (helpWhatsapp) {

  const message =
    "السلام عليكم، أريد المساعدة في اختيار جهاز مناسب.";

  helpWhatsapp.href =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

}


// ===============================
// Phone Number
// ===============================

const phoneText =
  document.getElementById("phoneText");

if (phoneText) {

  phoneText.textContent =
    WHATSAPP_NUMBER;

}


// ===============================
// Theme Button
// ===============================

const themeBtn =
  document.getElementById("themeBtn");

if (themeBtn) {

  themeBtn.onclick = () => {

    document.body.classList.toggle("light");

  };

}

async function testSupabase() {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/products?select=*`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    const data = await response.json();

    console.log("Supabase Products:", data);

  } catch (error) {

    console.error(
      "Supabase Error:",
      error
    );

  }
}

testSupabase();
// ===============================
// Initial Render
// ===============================

render();
alert("TEST PC ZONE");
async function testSupabaseConnection() {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/products?select=id&limit=1`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    if (response.ok) {
      alert("🟢 Supabase متصل بنجاح!");
    } else {
      alert("🔴 Supabase غير متصل\nError: " + response.status);
    }

  } catch (error) {
    alert("🔴 حصل خطأ في الاتصال بـ Supabase");
  }
}

testSupabaseConnection();
