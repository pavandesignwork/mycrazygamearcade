import { useEffect, useState } from "react";
import {
  getGames,
  createGame,
  updateGame,
  deleteGame,
  uploadThumbnail,
} from "../lib/supabase";

const CATEGORIES = ["action", "adventure", "puzzle", "racing", "sports", "arcade", "runner", "shooter", "other"];

function extractUrl(input) {
  const match = input.match(/src=["']([^"']+)["']/);
  return match ? match[1] : input.trim();
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("admin_auth") === "true");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  // Form
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");
  const [category, setCategory] = useState("other");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const loadGames = () => {
    getGames()
      .then(setGames)
      .catch(() => setGames([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadGames(); }, []);

  const flash = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setTitle("");
    setEmbedUrl("");
    setCategory("other");
    setThumbnailFile(null);
    setThumbnailPreview("");
  };

  const openNew = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (game) => {
    setEditingId(game.id);
    setTitle(game.title);
    setEmbedUrl(game.embed_url);
    setCategory(game.category || "other");
    setThumbnailPreview(game.thumbnail || "");
    setThumbnailFile(null);
    setShowForm(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!title.trim() || !embedUrl.trim()) {
      flash("Title and Embed URL are required");
      return;
    }

    setSaving(true);
    try {
      let thumbnailUrl = thumbnailPreview;

      // Upload thumbnail if new file selected
      if (thumbnailFile) {
        const ext = thumbnailFile.name.split(".").pop();
        const fileName = `${slugify(title)}-${Date.now()}.${ext}`;
        thumbnailUrl = await uploadThumbnail(thumbnailFile, fileName);
      }

      const gameData = {
        title: title.trim(),
        embed_url: embedUrl.trim(),
        category,
        thumbnail: thumbnailUrl,
      };

      if (editingId) {
        await updateGame(editingId, gameData);
        flash("Game updated!");
      } else {
        gameData.id = slugify(title);
        await createGame(gameData);
        flash("Game added!");
      }

      resetForm();
      loadGames();
    } catch (err) {
      flash("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this game?")) return;
    try {
      await deleteGame(id);
      flash("Game deleted!");
      loadGames();
    } catch (err) {
      flash("Error: " + err.message);
    }
  };

  const filtered = games.filter((g) =>
    g.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      sessionStorage.setItem("admin_auth", "true");
      setAuthError("");
    } else {
      setAuthError("Wrong password");
    }
  };

  const handleLogout = () => {
    setAuthed(false);
    sessionStorage.removeItem("admin_auth");
  };

  if (!authed) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginBox}>
          <h2 style={{ marginTop: 0 }}>Admin Login</h2>
          {authError && <p style={{ color: "red", fontSize: 14 }}>{authError}</p>}
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            style={styles.input}
          />
          <button onClick={handleLogin} style={{ ...styles.addBtn, marginTop: 12, width: "100%" }}>
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.h1}>Game CMS</h1>
          <p style={styles.subtitle}>{games.length} games</p>
        </div>
        <div style={styles.headerActions}>
          <a href="/" style={styles.backLink}>View Site</a>
          <button onClick={openNew} style={styles.addBtn}>+ Add Game</button>
          <button onClick={handleLogout} style={styles.editBtn}>Logout</button>
        </div>
      </div>

      {message && <div style={styles.message}>{message}</div>}

      {/* ── Form Modal ── */}
      {showForm && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>{editingId ? "Edit Game" : "Add New Game"}</h2>

            <label style={styles.label}>Title *</label>
            <input
              style={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Subway Surfers"
            />

            <label style={styles.label}>Embed URL * (paste URL or full iframe tag)</label>
            <input
              style={styles.input}
              value={embedUrl}
              onChange={(e) => setEmbedUrl(extractUrl(e.target.value))}
              placeholder="https://html5.gamedistribution.com/... or paste <iframe> tag"
            />

            <label style={styles.label}>Category</label>
            <select style={styles.input} value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <label style={styles.label}>Thumbnail</label>
            <input type="file" accept="image/*" onChange={handleFileChange} style={styles.fileInput} />
            {thumbnailPreview && (
              <img src={thumbnailPreview} alt="preview" style={styles.preview} />
            )}

            <div style={styles.modalActions}>
              <button onClick={resetForm} style={styles.cancelBtn}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={styles.saveBtn}>
                {saving ? "Saving..." : editingId ? "Update" : "Add Game"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Search ── */}
      <input
        style={styles.search}
        placeholder="Search games..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* ── Games Table ── */}
      {loading ? (
        <p style={{ textAlign: "center", padding: 40, color: "#999" }}>Loading...</p>
      ) : (
        <div style={styles.table}>
          <div style={styles.tableHeader}>
            <span style={styles.colThumb}>Thumb</span>
            <span style={styles.colTitle}>Title</span>
            <span style={styles.colCat}>Category</span>
            <span style={styles.colActions}>Actions</span>
          </div>
          {filtered.length === 0 && (
            <p style={{ textAlign: "center", padding: 30, color: "#999" }}>
              {search ? "No matches" : "No games yet. Click '+ Add Game' to start."}
            </p>
          )}
          {filtered.map((game) => (
            <div key={game.id} style={styles.tableRow}>
              <span style={styles.colThumb}>
                {game.thumbnail ? (
                  <img src={game.thumbnail} alt="" style={styles.thumbImg} />
                ) : (
                  <div style={styles.thumbPlaceholder}>?</div>
                )}
              </span>
              <span style={styles.colTitle}>
                <strong>{game.title}</strong>
                <br />
                <small style={{ color: "#999" }}>{game.id}</small>
              </span>
              <span style={styles.colCat}>
                <span style={styles.badge}>{game.category}</span>
              </span>
              <span style={styles.colActions}>
                <button onClick={() => openEdit(game)} style={styles.editBtn}>Edit</button>
                <button onClick={() => handleDelete(game.id)} style={styles.deleteBtn}>Delete</button>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: 900, margin: "0 auto", padding: 20, fontFamily: "-apple-system, sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  h1: { margin: 0, fontSize: 28 },
  subtitle: { margin: 0, color: "#999", fontSize: 14 },
  headerActions: { display: "flex", gap: 12, alignItems: "center" },
  backLink: { color: "#6C5CE7", textDecoration: "none", fontSize: 14 },
  addBtn: { background: "#6C5CE7", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 14 },
  message: { background: "#e8f5e9", color: "#2e7d32", padding: "10px 16px", borderRadius: 8, marginBottom: 16, fontSize: 14 },
  search: { width: "100%", padding: "10px 16px", border: "1px solid #ddd", borderRadius: 8, fontSize: 14, marginBottom: 16, outline: "none", boxSizing: "border-box" },
  table: { background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" },
  tableHeader: { display: "flex", padding: "12px 16px", background: "#f9f9f9", borderBottom: "1px solid #eee", fontWeight: 600, fontSize: 12, textTransform: "uppercase", color: "#999" },
  tableRow: { display: "flex", padding: "12px 16px", borderBottom: "1px solid #f0f0f0", alignItems: "center" },
  colThumb: { width: 60, flexShrink: 0 },
  colTitle: { flex: 1, minWidth: 0 },
  colCat: { width: 100, flexShrink: 0, textAlign: "center" },
  colActions: { width: 140, flexShrink: 0, textAlign: "right", display: "flex", gap: 8, justifyContent: "flex-end" },
  thumbImg: { width: 50, height: 34, objectFit: "cover", borderRadius: 4 },
  thumbPlaceholder: { width: 50, height: 34, background: "#eee", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", color: "#ccc", fontSize: 12 },
  badge: { background: "#f0f0f0", padding: "2px 8px", borderRadius: 12, fontSize: 12 },
  editBtn: { background: "#f0f0f0", border: "none", padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontSize: 12 },
  deleteBtn: { background: "#fff0f0", color: "#e53935", border: "none", padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontSize: 12 },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 },
  modal: { background: "#fff", borderRadius: 16, padding: 30, width: "100%", maxWidth: 500, maxHeight: "90vh", overflowY: "auto" },
  modalTitle: { marginTop: 0, marginBottom: 20 },
  label: { display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4, marginTop: 14, color: "#555" },
  input: { width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box" },
  fileInput: { marginTop: 4 },
  preview: { width: 120, height: 80, objectFit: "cover", borderRadius: 8, marginTop: 8 },
  modalActions: { display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 },
  cancelBtn: { background: "none", border: "none", padding: "10px 16px", cursor: "pointer", color: "#999", fontSize: 14 },
  saveBtn: { background: "#6C5CE7", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 14 },
  loginContainer: { display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "-apple-system, sans-serif" },
  loginBox: { background: "#fff", padding: 30, borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.1)", width: "100%", maxWidth: 360 },
};
