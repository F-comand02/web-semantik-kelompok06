import React, { useEffect, useMemo, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, RotateCcw } from 'lucide-react';

const MEDAN_CENTER = [3.5896, 98.6738];
const DEFAULT_ZOOM = 12;

function createPinIcon(isHalal, dishCount = 1, isHighlighted = false) {
  const bg = isHalal ? '#10b981' : '#f43f5e';
  const ring = isHighlighted ? '0 0 0 5px rgba(29,99,237,0.32)' : '0 3px 10px rgba(15,23,42,0.32)';
  const size = isHighlighted ? 32 : 26;
  const badge =
    dishCount > 1
      ? `<span style="position:absolute;top:-6px;right:-7px;min-width:17px;height:17px;padding:0 4px;border-radius:999px;background:#1d63ed;color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;border:1.5px solid #fff;">${dishCount}</span>`
      : '';

  return L.divIcon({
    className: 'ranah-kulmed-pin',
    html: `<div style="position:relative;width:${size}px;height:${size}px;border-radius:999px 999px 999px 4px;transform:rotate(-45deg);background:${bg};border:2.5px solid #ffffff;box-shadow:${ring};display:flex;align-items:center;justify-content:center;">
      <div style="width:8px;height:8px;border-radius:999px;background:#ffffff;transform:rotate(45deg);"></div>
      <div style="transform:rotate(45deg);">${badge}</div>
    </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size + 4],
  });
}

export default function MedanCulinaryMap({
  dishes = [],
  singleDish = null,
  onSelectDish,
  darkMode = false,
  heightClass = 'h-[430px]',
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersLayerRef = useRef(null);

  // Group dishes by venue coordinates so overlapping dishes at the same venue appear neatly in one pin
  const venueGroups = useMemo(() => {
    const source = singleDish ? [singleDish] : dishes;
    const map = new Map();

    source.forEach((d) => {
      const lat = Number(d?.restoran?.lat);
      const lng = Number(d?.restoran?.long);
      if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat === 0 || lng === 0) return;

      const key = `${d.restoran.nama || d.slug}_${lat.toFixed(4)}_${lng.toFixed(4)}`;
      if (!map.has(key)) {
        map.set(key, {
          key,
          lat,
          lng,
          restoran: d.restoran,
          dishes: [],
          allHalal: true,
        });
      }
      const group = map.get(key);
      group.dishes.push(d);
      if (!d.isHalal) group.allHalal = false;
    });

    return Array.from(map.values());
  }, [dishes, singleDish]);

  // Initialize Leaflet instance once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const initialCenter =
      singleDish?.restoran?.lat && singleDish?.restoran?.long
        ? [Number(singleDish.restoran.lat), Number(singleDish.restoran.long)]
        : MEDAN_CENTER;

    const map = L.map(containerRef.current, {
      center: initialCenter,
      zoom: singleDish ? 15 : DEFAULT_ZOOM,
      scrollWheelZoom: !singleDish,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · WGS84 RDF Geo',
      maxZoom: 19,
    }).addTo(map);

    const layer = L.layerGroup().addTo(map);
    mapRef.current = map;
    markersLayerRef.current = layer;

    // Ensure proper sizing inside modals / animated containers
    const resizeTimer = setTimeout(() => map.invalidateSize(), 220);

    return () => {
      clearTimeout(resizeTimer);
      map.remove();
      mapRef.current = null;
      markersLayerRef.current = null;
    };
  }, [singleDish]);

  // Render markers reactively whenever filtered dishes change
  useEffect(() => {
    const map = mapRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();
    if (!venueGroups.length) return;

    const bounds = [];

    venueGroups.forEach((vg) => {
      bounds.push([vg.lat, vg.lng]);
      const marker = L.marker([vg.lat, vg.lng], {
        icon: createPinIcon(vg.allHalal, vg.dishes.length, Boolean(singleDish)),
      });

      const popupContainer = document.createElement('div');
      popupContainer.style.minWidth = '210px';
      popupContainer.style.maxWidth = '260px';
      popupContainer.style.fontFamily = 'Inter, system-ui, sans-serif';

      const restoTitle = document.createElement('p');
      restoTitle.style.cssText = 'margin:0;font-weight:800;font-size:13px;color:#0f172a;line-height:1.3;';
      restoTitle.textContent = vg.restoran.nama || 'Tempat Kuliner Medan';
      popupContainer.appendChild(restoTitle);

      const addr = document.createElement('p');
      addr.style.cssText = 'margin:3px 0 6px;font-size:11px;color:#64748b;line-height:1.35;';
      addr.textContent = `${vg.restoran.alamat || ''}${vg.restoran.kecamatan ? ` · ${vg.restoran.kecamatan}` : ''}`;
      popupContainer.appendChild(addr);

      const meta = document.createElement('div');
      meta.style.cssText = 'display:flex;align-items:center;gap:6px;margin-bottom:8px;font-size:10px;font-weight:700;';
      meta.innerHTML = `<span style="padding:2px 7px;border-radius:999px;background:${
        vg.allHalal ? '#dcfce7;color:#15803d' : '#ffe4e6;color:#be123c'
      }">${vg.allHalal ? 'Halal' : 'Tersedia Non-Halal'}</span>
      ${vg.restoran.rating ? `<span style="color:#d97706;">★ ${vg.restoran.rating}</span>` : ''}
      <span style="color:#94a3b8;font-family:monospace;">${vg.lat.toFixed(4)}, ${vg.lng.toFixed(4)}</span>`;
      popupContainer.appendChild(meta);

      if (!singleDish && onSelectDish) {
        const listWrap = document.createElement('div');
        listWrap.style.cssText =
          'max-height:130px;overflow-y:auto;border-top:1px solid #e2e8f0;padding-top:6px;display:flex;flex-direction:column;gap:4px;';

        vg.dishes.slice(0, 8).forEach((dish) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.style.cssText =
            'text-align:left;padding:5px 8px;border-radius:8px;background:#f1f5f9;border:1px solid #e2e8f0;font-size:11px;font-weight:600;color:#1d63ed;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:6px;';
          btn.innerHTML = `<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${dish.nama}</span><span style="color:#475569;font-size:10px;flex-shrink:0;">Detail →</span>`;
          btn.onclick = () => onSelectDish(dish);
          listWrap.appendChild(btn);
        });

        if (vg.dishes.length > 8) {
          const more = document.createElement('p');
          more.style.cssText = 'margin:2px 0 0;font-size:10px;color:#64748b;text-align:center;';
          more.textContent = `+${vg.dishes.length - 8} menu lainnya di lokasi ini`;
          listWrap.appendChild(more);
        }

        popupContainer.appendChild(listWrap);
      }

      marker.bindPopup(popupContainer);
      marker.addTo(layer);

      if (singleDish) {
        setTimeout(() => marker.openPopup(), 260);
      }
    });

    if (singleDish && bounds.length === 1) {
      map.setView(bounds[0], 15);
    } else if (bounds.length === 1) {
      map.setView(bounds[0], 14);
    } else if (bounds.length > 1) {
      map.fitBounds(bounds, { padding: [36, 36], maxZoom: 14 });
    }
  }, [venueGroups, singleDish, onSelectDish]);

  const resetMapView = () => {
    if (!mapRef.current) return;
    if (venueGroups.length > 1) {
      mapRef.current.fitBounds(
        venueGroups.map((v) => [v.lat, v.lng]),
        { padding: [36, 36], maxZoom: 14 }
      );
    } else {
      mapRef.current.setView(MEDAN_CENTER, DEFAULT_ZOOM);
    }
  };

  return (
    <div
      className={`rounded-2xl border overflow-hidden ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'
      }`}
    >
      {!singleDish && (
        <div
          className={`px-4 py-3 border-b flex flex-wrap items-center justify-between gap-3 text-xs ${
            darkMode ? 'border-slate-800 text-slate-300' : 'border-slate-100 text-slate-600'
          }`}
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-bold text-[#1d63ed] dark:text-sky-400 flex items-center gap-1.5">
              <MapPin className="w-4 h-4" /> Peta Geospasial WGS84 Kuliner Medan
            </span>
            <span className="text-slate-400">·</span>
            <span>
              <strong>{venueGroups.length}</strong> titik restoran dari <strong>{dishes.length}</strong> hidangan
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Halal
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Non-Halal
            </span>
            <button
              type="button"
              onClick={resetMapView}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border font-semibold cursor-pointer ${
                darkMode
                  ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <RotateCcw className="w-3 h-3" /> Reset Peta
            </button>
          </div>
        </div>
      )}

      <div ref={containerRef} className={`w-full ${heightClass} z-0`} />
    </div>
  );
}
