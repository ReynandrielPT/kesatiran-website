"use client";
import { useEffect, useRef, useState } from "react";

/** One demand-rendered scene shared across routes; no permanent animation loop. */
export function SpatialWorld() {
  const host = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  useEffect(() => {
    const media = matchMedia(
      "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
    );
    const stored = localStorage.getItem("spatial-view");
    setEnabled(stored === "off" ? false : media.matches);
    const change = () =>
      setEnabled(
        media.matches && localStorage.getItem("spatial-view") !== "off",
      );
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);
  useEffect(() => {
    if (!enabled || !host.current) return;
    let disposed = false;
    let cleanup = () => {};
    const timer = window.setTimeout(async () => {
      try {
        const T = await import("three");
        if (disposed || !host.current) return;
        const renderer = new T.WebGLRenderer({
          alpha: true,
          antialias: false,
          powerPreference: "low-power",
        });
        renderer.setPixelRatio(Math.min(devicePixelRatio, 1.25));
        renderer.setClearColor(0, 0);
        host.current.appendChild(renderer.domElement);
        renderer.domElement.setAttribute("aria-hidden", "true");
        const scene = new T.Scene();
        const camera = new T.PerspectiveCamera(
          38,
          innerWidth / innerHeight,
          0.1,
          50,
        );
        camera.position.z = 11;
        const world = new T.Group();
        scene.add(world);
        const material = new T.MeshPhysicalMaterial({
          color: 0x83c5df,
          metalness: 0.65,
          roughness: 0.22,
          clearcoat: 0.8,
        });
        const geometry = new T.TorusKnotGeometry(1.5, 0.36, 96, 12, 2, 3);
        const knot = new T.Mesh(geometry, material);
        knot.position.set(2.7, 0.2, 0);
        world.add(knot);
        const ringGeometry = new T.TorusGeometry(2.6, 0.012, 6, 80);
        const ringMaterial = new T.MeshBasicMaterial({
          color: 0x6d9db8,
          transparent: true,
          opacity: 0.45,
        });
        const rings = [0, 1, 2].map((i) => {
          const r = new T.Mesh(ringGeometry, ringMaterial);
          r.position.copy(knot.position);
          r.rotation.set(0.6 + i * 0.65, 0.3 + i * 0.5, 0.2);
          world.add(r);
          return r;
        });
        const sphereGeometry = new T.IcosahedronGeometry(0.16, 1);
        for (let i = 0; i < 7; i++) {
          const m = new T.Mesh(sphereGeometry, material);
          m.position.set(
            2.7 + Math.cos((i * 6.28) / 7) * 2.6,
            Math.sin((i * 6.28) / 7) * 2.6,
            0.5,
          );
          world.add(m);
        }
        scene.add(new T.HemisphereLight(0xd4efff, 0x1f253b, 3));
        const key = new T.DirectionalLight(0xffffff, 5);
        key.position.set(-3, 5, 6);
        scene.add(key);
        const rim = new T.DirectionalLight(0x6e86ff, 4);
        rim.position.set(5, -2, 2);
        scene.add(rim);
        let frame = 0;
        let last = 0;
        let x = 0,
          y = 0;
        function draw(time: number) {
          frame = 0;
          if (document.hidden || disposed) return;
          if (time - last < 33) {
            frame = requestAnimationFrame(draw);
            return;
          }
          last = time;
          knot.rotation.set(
            0.25 + y * 0.2 + scrollY * 0.00015,
            x * 0.3 + scrollY * 0.00025,
            -0.2,
          );
          world.position.y = -Math.min(scrollY / innerHeight, 2) * 0.2;
          renderer.render(scene, camera);
        }
        function request() {
          if (!frame && !disposed && !document.hidden)
            frame = requestAnimationFrame(draw);
        }
        function pointer(e: PointerEvent) {
          x = e.clientX / innerWidth - 0.5;
          y = e.clientY / innerHeight - 0.5;
          request();
        }
        function resize() {
          renderer.setSize(innerWidth, innerHeight);
          camera.aspect = innerWidth / innerHeight;
          camera.updateProjectionMatrix();
          request();
        }
        function lost(e: Event) {
          e.preventDefault();
          setUnavailable(true);
          setEnabled(false);
        }
        renderer.domElement.addEventListener("webglcontextlost", lost);
        window.addEventListener("pointermove", pointer, { passive: true });
        window.addEventListener("scroll", request, { passive: true });
        window.addEventListener("resize", resize);
        document.addEventListener("visibilitychange", request);
        resize();
        cleanup = () => {
          cancelAnimationFrame(frame);
          window.removeEventListener("pointermove", pointer);
          window.removeEventListener("scroll", request);
          window.removeEventListener("resize", resize);
          document.removeEventListener("visibilitychange", request);
          renderer.domElement.removeEventListener("webglcontextlost", lost);
          geometry.dispose();
          ringGeometry.dispose();
          sphereGeometry.dispose();
          material.dispose();
          ringMaterial.dispose();
          renderer.dispose();
          renderer.forceContextLoss();
          renderer.domElement.remove();
          rings.length = 0;
        };
      } catch {
        if (!disposed) {
          setUnavailable(true);
          setEnabled(false);
        }
      }
    }, 500);
    return () => {
      disposed = true;
      clearTimeout(timer);
      cleanup();
    };
  }, [enabled]);
  return (
    <>
      <div className="spatial-world" ref={host} aria-hidden="true">
        <div className="spatial-fallback">
          <i />
          <i />
          <i />
        </div>
      </div>
      <button
        className="spatial-switch"
        aria-pressed={enabled}
        disabled={unavailable}
        onClick={() => {
          localStorage.setItem("spatial-view", enabled ? "off" : "on");
          setEnabled(!enabled);
        }}
      >
        {unavailable ? "Light view" : enabled ? "3D view on" : "3D view off"}
        <span aria-hidden>{enabled ? "◉" : "○"}</span>
      </button>
    </>
  );
}
