// ==========================================
// PC ZONE - Supabase Store
// ==========================================

// WhatsApp رقم المتجر
// اكتب الرقم بصيغة دولية بدون + أو مسافات
const WHATSAPP_NUMBER = "201000000000";

// Supabase
const SUPABASE_URL =
  "https://sbvwosejthyuotcsmvki.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_Qok45Wzs4mVmPwW8jlaxzA_qxuoSWdU";


// ==========================================
// Supabase Request
// ==========================================

async function getProductsFromSupabase() {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/products?select=*&order=created_at.desc`,
    {
      method: "GET",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    }
  );

  if (!response.ok) {
    throw new Error(
      `Supabase Error: ${response.status}`
    );
  }

  return await response.json();
}


// ==========================================
// Category Names
// ==========================================

const categoryNames = {
  laptops: "لابتوبات",
  pcs: "PC & Gaming",
  components: "قطع الكمبيوتر",
  monitors: "الشاشات",
  accessories: "إكسسوارات",
  other: "منتجات أخرى"
};


// ==========================================
// Global Products
// ==========================================

let products = [];

window.activeCategory = null;


// ==========================================
// Money
// ==========================================

function money(value) {
  return Number(value || 0).toLocaleString("en-US") + " ج.م";
}


// ==========================================
// WhatsApp
// ==========================================

function whatsappLink(product) {

  const message =
`السلام عليكم 👋

أريد الاستفسار عن المنتج:

💻 ${product.name}

💰 السعر: ${money(product.price)}

هل المنتج متوفر؟`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}


// ==========================================
// Product Image
// ==========================================

function productImage(product) {

  if (product.image_url) {

    return `
      <img
        src="${product.image_url}"
        alt="${product.name}"
        loading="lazy"
      >
    `;

  }

  return `
    <div class="noimg">
      💻
    </div>
  `;
}


// ==========================================
// Render Products
// ==========================================

function render() {

  const grid =
    document.getElementById("productGrid");

  const empty =
    document.getElementById("empty");

  if (!grid) return;


  const searchInput =
    document.getElementById("search");

  const search =
    searchInput
      ? searchInput.value.trim().toLowerCase()
      : "";


  const sort =
    document.getElementById("sort");


  let filtered = [...products];


  // ==========================
  // Category
  // ==========================

  if (window.activeCategory) {

    filtered = filtered.filter(
      product =>
        product.category ===
        window.activeCategory
    );

  }


  // ==========================
  // Search
  // ==========================

  if (search) {

    filtered = filtered.filter(product => {

      const text = `
        ${product.name || ""}
        ${product.description || ""}
        ${product.specs || ""}
        ${categoryNames[product.category] || ""}
      `.toLowerCase();

      return text.includes(search);

    });

  }


  // ==========================
  // Sorting
  // ==========================

  if (sort) {

    if (sort.value === "low") {

      filtered.sort(
        (a, b) =>
          Number(a.price) -
          Number(b.price)
      );

    }

    else if (sort.value === "high") {

      filtered.sort(
        (a, b) =>
          Number(b.price) -
          Number(a.price)
      );

    }

    else {

      filtered.sort(
        (a, b) =>
          new Date(b.created_at) -
          new Date(a.created_at)
      );

    }

  }


  grid.innerHTML = "";


  // ==========================
  // Empty
  // ==========================

  if (empty) {

    empty.classList.toggle(
      "hidden",
      filtered.length > 0
    );

  }


  // ==========================
  // Products
  // ==========================

  filtered.forEach(product => {

    const article =
      document.createElement("article");

    article.className =
      "product";


    article.innerHTML = `

      <div class="product-img">

        ${productImage(product)}

        <span class="badge">
          ${
            product.stock
              ? "متوفر"
              : "غير متوفر"
          }
        </span>

      </div>


      <div class="product-body">

        <span class="eyebrow">
          ${
            categoryNames[
              product.category
            ] || "PC ZONE"
          }
        </span>


        <h3>
          ${product.name}
        </h3>


        <div class="spec">
          ${product.specs || ""}
        </div>


        ${
          product.old_price &&
          Number(product.old_price) >
          Number(product.price)
          ?
          `
          <div class="old-price">
            ${money(product.old_price)}
          </div>
          `
          :
          ""
        }


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


          ${
            product.stock
            ?
            `
            <a
              class="small-btn wa"
              href="${whatsappLink(product)}"
              target="_blank"
              rel="noopener"
            >
              WhatsApp
            </a>
            `
            :
            `
            <button
              class="small-btn"
              disabled
            >
              غير متوفر
            </button>
            `
          }

        </div>

      </div>

    `;


    grid.appendChild(article);

  });

}


// ==========================================
// Product Details
// ==========================================

function showDetails(id) {

  const product =
    products.find(
      item => Number(item.id) === Number(id)
    );


  if (!product) return;


  const modal =
    document.getElementById("modal");

  const content =
    document.getElementById("modalContent");


  content.innerHTML = `

    <div class="detail">

      <div class="detail-img">
        ${productImage(product)}
      </div>


      <div>

        <span class="eyebrow">
          ${
            categoryNames[
              product.category
            ] || "PC ZONE"
          }
        </span>


        <h2>
          ${product.name}
        </h2>


        ${
          product.old_price &&
          Number(product.old_price) >
          Number(product.price)
          ?
          `
          <div class="old-price">
            ${money(product.old_price)}
          </div>
          `
          :
          ""
        }


        <div class="price">
          ${money(product.price)}
        </div>


        ${
          product.description
          ?
          `
          <p>
            ${product.description}
          </p>
          `
          :
          ""
        }


        ${
          product.specs
          ?
          `
          <div class="spec detail-spec">
            ${product.specs}
          </div>
          `
          :
          ""
        }


        <p>
          ${
            product.stock
              ? "🟢 المنتج متوفر حاليًا"
              : "🔴 المنتج غير متوفر حاليًا"
          }
        </p>


        ${
          product.stock
          ?
          `
          <a
            class="btn primary"
            href="${whatsappLink(product)}"
            target="_blank"
            rel="noopener"
          >
            اطلب عبر WhatsApp
          </a>
          `
          :
          ""
        }

      </div>

    </div>

  `;


  modal.classList.remove("hidden");

}


// ==========================================
// Close Modal
// ==========================================

const closeModal =
  document.getElementById("closeModal");

const modal =
  document.getElementById("modal");


if (closeModal) {

  closeModal.addEventListener(
    "click",
    () => {

      modal.classList.add("hidden");

    }
  );

}


if (modal) {

  modal.addEventListener(
    "click",
    event => {

      if (
        event.target === modal
      ) {

        modal.classList.add("hidden");

      }

    }
  );

}


// ==========================================
// Search
// ==========================================

const search =
  document.getElementById("search");

if (search) {

  search.addEventListener(
    "input",
    render
  );

}


// ==========================================
// Sort
// ==========================================

const sort =
  document.getElementById("sort");

if (sort) {

  sort.addEventListener(
    "change",
    render
  );

}


// ==========================================
// Categories
// ==========================================

document
  .querySelectorAll(".category")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const category =
          button.dataset.cat;


        if (
          window.activeCategory ===
          category
        ) {

          window.activeCategory =
            null;

        }

        else {

          window.activeCategory =
            category;

        }


        render();


        const productsSection =
          document.getElementById(
            "products"
          );


        if (productsSection) {

          productsSection.scrollIntoView({
            behavior: "smooth"
          });

        }

      }
    );

  });


// ==========================================
// Theme
// ==========================================

const themeBtn =
  document.getElementById("themeBtn");

if (themeBtn) {

  themeBtn.addEventListener(
    "click",
    () => {

      document.body.classList.toggle(
        "light"
      );

      localStorage.setItem(
        "pczone_theme",
        document.body.classList.contains(
          "light"
        )
          ? "light"
          : "dark"
      );

    }
  );

}


// Restore Theme

if (
  localStorage.getItem(
    "pczone_theme"
  ) === "light"
) {

  document.body.classList.add(
    "light"
  );

}


// ==========================================
// WhatsApp Help Button
// ==========================================

const helpWhatsapp =
  document.getElementById(
    "helpWhatsapp"
  );


if (helpWhatsapp) {

  const message =
`السلام عليكم 👋

محتاج مساعدة في اختيار جهاز كمبيوتر أو لابتوب.

الميزانية:
الاستخدام:
`;

  helpWhatsapp.href =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

}


// ==========================================
// Phone
// ==========================================

const phoneText =
  document.getElementById(
    "phoneText"
  );


if (phoneText) {

  phoneText.textContent =
    WHATSAPP_NUMBER;

}


// ==========================================
// Load Products
// ==========================================

async function loadProducts() {

  const grid =
    document.getElementById(
      "productGrid"
    );


  try {

    if (grid) {

      grid.innerHTML = `
        <div style="
          width:100%;
          text-align:center;
          padding:40px;
        ">
          جاري تحميل المنتجات...
        </div>
      `;

    }


    products =
      await getProductsFromSupabase();


    render();


  }

  catch (error) {

    console.error(error);


    if (grid) {

      grid.innerHTML = `
        <div style="
          width:100%;
          text-align:center;
          padding:40px;
        ">
          <h3>
            حدث خطأ في تحميل المنتجات
          </h3>

          <p>
            تأكد من اتصال قاعدة البيانات.
          </p>
        </div>
      `;

    }

  }

}


// ==========================================
// Start
// ==========================================

loadProducts();
