// ==========================================
// PC ZONE - Full Supabase Store
// ==========================================

// ==========================
// SETTINGS
// ==========================

const WHATSAPP_NUMBER = "201000000000";

const SUPABASE_URL =
  "https://sbvwosejthyuotcsmvki.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_Qok45Wzs4mVmPwW8jlaxzA_qxuoSWdU";


// ==========================
// CATEGORY NAMES
// ==========================

const categoryNames = {
  laptops: "لابتوبات",
  pcs: "PC & Gaming",
  components: "قطع الكمبيوتر",
  monitors: "الشاشات",
  accessories: "إكسسوارات",
  other: "منتجات أخرى"
};


// ==========================
// GLOBAL
// ==========================

let products = [];
let activeProduct = null;

window.activeCategory = null;


// ==========================
// MONEY
// ==========================

function money(value) {
  return Number(value || 0).toLocaleString("en-US") + " ج.م";
}


// ==========================
// SUPABASE REQUEST
// ==========================

async function supabaseRequest(
  table,
  options = {}
) {

  const {
    method = "GET",
    query = "",
    body = null
  } = options;

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/${table}${query}`,
    {
      method,

      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,

        ...(body
          ? {
              "Content-Type": "application/json",
              Prefer: "return=representation"
            }
          : {})
      },

      ...(body
        ? {
            body: JSON.stringify(body)
          }
        : {})
    }
  );

  if (!response.ok) {

    const text =
      await response.text();

    throw new Error(
      `${table} ${response.status}: ${text}`
    );

  }

  if (response.status === 204) {
    return null;
  }

  return await response.json();
}


// ==========================
// LOAD PRODUCTS
// ==========================

async function getProductsFromSupabase() {

  return await supabaseRequest(
    "products",
    {
      query:
        "?select=*&order=created_at.desc"
    }
  );

}


// ==========================
// LOAD PRODUCT IMAGES
// ==========================

async function getProductImages(productId) {

  return await supabaseRequest(
    "product_images",
    {
      query:
        `?select=*&product_id=eq.${productId}&order=sort_order.asc,created_at.asc`
    }
  );

}


// ==========================
// LOAD COMMENTS
// ==========================

async function getProductComments(productId) {

  return await supabaseRequest(
    "product_comments",
    {
      query:
        `?select=*&product_id=eq.${productId}&approved=eq.true&order=created_at.desc`
    }
  );

}


// ==========================
// WHATSAPP
// ==========================

function whatsappLink(product) {

  const message =
`السلام عليكم 👋

أريد الاستفسار عن المنتج:

💻 ${product.name}

💰 السعر: ${money(product.price)}

هل المنتج متوفر؟`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

}


// ==========================
// PRODUCT IMAGE
// ==========================

function productImage(product) {

  if (product.image_url) {

    return `
      <img
        src="${escapeHtml(product.image_url)}"
        alt="${escapeHtml(product.name || "PC Zone Product")}"
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


// ==========================
// ESCAPE HTML
// ==========================

function escapeHtml(value) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


// ==========================
// RENDER PRODUCTS
// ==========================

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


  // CATEGORY

  if (window.activeCategory) {

    filtered =
      filtered.filter(
        product =>
          product.category ===
          window.activeCategory
      );

  }


  // SEARCH

  if (search) {

    filtered =
      filtered.filter(product => {

        const text = `
          ${product.name || ""}
          ${product.description || ""}
          ${product.specs || ""}
          ${categoryNames[product.category] || ""}
        `.toLowerCase();

        return text.includes(search);

      });

  }


  // SORT

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


  if (empty) {

    empty.classList.toggle(
      "hidden",
      filtered.length > 0
    );

  }


  filtered.forEach(product => {

    const article =
      document.createElement("article");

    article.className = "product";


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
          ${escapeHtml(product.name)}
        </h3>

        <div class="spec">
          ${escapeHtml(product.specs || "")}
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


// ==========================
// SHOW PRODUCT DETAILS
// ==========================

async function showDetails(id) {

  const product =
    products.find(
      item =>
        Number(item.id) ===
        Number(id)
    );

  if (!product) return;


  activeProduct = product;


  const modal =
    document.getElementById("modal");

  const content =
    document.getElementById(
      "modalContent"
    );

  if (!modal || !content) return;


  modal.classList.remove("hidden");


  content.innerHTML = `
    <div style="text-align:center;padding:40px">
      جاري تحميل تفاصيل المنتج...
    </div>
  `;


  try {

    const [
      images,
      comments
    ] = await Promise.all([
      getProductImages(product.id),
      getProductComments(product.id)
    ]);


    renderProductDetails(
      product,
      images,
      comments
    );

  }

  catch (error) {

    console.error(error);

    renderProductDetails(
      product,
      [],
      []
    );

  }

}


// ==========================
// PRODUCT DETAILS UI
// ==========================

function renderProductDetails(
  product,
  images,
  comments
) {

  const content =
    document.getElementById(
      "modalContent"
    );

  if (!content) return;


  let galleryImages = [];


  if (product.image_url) {

    galleryImages.push({
      image_url:
        product.image_url
    });

  }


  galleryImages =
    galleryImages.concat(images);


  const uniqueImages =
    galleryImages.filter(
      (image, index, array) =>
        index ===
        array.findIndex(
          item =>
            item.image_url ===
            image.image_url
        )
    );


  const commentsHtml =
    comments.length
      ?
      comments.map(comment => {

        const stars =
          "★".repeat(
            Number(comment.rating)
          ) +
          "☆".repeat(
            5 -
            Number(comment.rating)
          );

        return `
          <div class="comment-item">

            <div class="comment-top">

              <strong>
                ${escapeHtml(comment.name)}
              </strong>

              <span class="comment-stars">
                ${stars}
              </span>

            </div>

            <p>
              ${escapeHtml(comment.comment)}
            </p>

          </div>
        `;

      }).join("")
      :
      `
        <div class="no-comments">
          لسه مفيش تقييمات للمنتج.
          كن أول واحد يضيف تقييم ⭐
        </div>
      `;


  const galleryHtml =
    uniqueImages.length
      ?
      `
      <div class="product-gallery">

        <div class="main-gallery-image">

          <img
            id="mainProductImage"
            src="${escapeHtml(
              uniqueImages[0].image_url
            )}"
            alt="${escapeHtml(product.name)}"
          >

        </div>

        ${
          uniqueImages.length > 1
          ?
          `
          <div class="gallery-thumbs">

            ${uniqueImages.map(
              (image, index) =>
                `
                <button
                  class="gallery-thumb ${
                    index === 0
                      ? "active"
                      : ""
                  }"
                  onclick="changeProductImage(
                    '${escapeHtml(
                      image.image_url
                    )}',
                    this
                  )"
                >
                  <img
                    src="${escapeHtml(
                      image.image_url
                    )}"
                    alt=""
                  >
                </button>
                `
            ).join("")}

          </div>
          `
          :
          ""
        }

      </div>
      `
      :
      `
      <div class="detail-img">
        ${productImage(product)}
      </div>
      `;


  content.innerHTML = `

    <div class="detail">

      <div>

        ${galleryHtml}

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
          ${escapeHtml(product.name)}
        </h2>


        ${
          product.old_price &&
          Number(product.old_price) >
          Number(product
