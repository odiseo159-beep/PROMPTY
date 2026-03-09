# Rust in Production: 5 Real-World Use Cases (2025)

Rust has moved well beyond a systems-programming curiosity. In 2025 it powers
everything from Linux kernel modules to browser-side WebAssembly, high-throughput
network services, resource-constrained microcontrollers, and developer CLI tooling.
Below are five diverse, production-proven use cases — each with a real-world anchor,
a practical code snippet, and an honest assessment of trade-offs.

---

## 1. Systems Programming — Linux Kernel & Operating Systems

### Real-world example: Linux Kernel (Rust for Linux) & Microsoft Windows

The Linux kernel merged official Rust support in version 6.1 (December 2022) and
has expanded it through every release since. By 2025 several in-tree kernel drivers
are written in Rust (e.g., the Apple AGX GPU driver and various filesystem helpers).
Microsoft has also been rewriting core Windows components — including parts of the
kernel and the Windows DNS server — in Rust for memory-safety guarantees without
sacrificing performance.

### Code snippet — a minimal Linux kernel module in Rust

```rust
// drivers/char/hello_rust/hello.rs  (simplified for illustration)
// Build with the kernel's Kbuild system: obj-m += hello_rust.o
#![no_std]
#![feature(allocator_api)]

use kernel::prelude::*;

module! {
    type: HelloModule,
    name: "hello_rust",
    author: "Example Author",
    description: "A minimal Rust kernel module",
    license: "GPL",
}

struct HelloModule;

impl kernel::Module for HelloModule {
    fn init(_module: &'static ThisModule) -> Result<Self> {
        pr_info!("Hello from Rust kernel module!\n");
        Ok(HelloModule)
    }
}

impl Drop for HelloModule {
    fn drop(&mut self) {
        pr_info!("Goodbye from Rust kernel module!\n");
    }
}
```

### Pros

- **Memory safety without a garbage collector** — the borrow checker eliminates
  entire classes of kernel bugs (use-after-free, data races) that C cannot prevent
  at compile time.
- **Zero-cost abstractions** — Rust's ownership model compiles away at the same
  level as hand-written C, keeping kernel overhead minimal.
- **Fearless concurrency** — the type system prevents data races across kernel
  threads at compile time rather than at runtime.
- **Incrementally adoptable** — C and Rust interoperate cleanly through FFI, so
  teams can port subsystems gradually without a full rewrite.

### Cons

- **Steep learning curve for kernel developers** — kernel contributors familiar
  with decades of C idioms must learn Rust's ownership model, which is a
  significant upfront investment.
- **Immature kernel abstractions** — the `kernel` crate's safe wrappers cover only
  a fraction of kernel APIs; developers often hit `unsafe` boundaries sooner than
  they would like.
- **Longer compile times** — Rust's compilation is noticeably slower than C,
  which matters for large codebases that rebuild frequently.
- **Toolchain coupling** — the kernel requires a specific minimum Rust toolchain
  version, complicating distribution packaging.

---

## 2. WebAssembly (Wasm) — High-Performance Browser & Edge Modules

### Real-world example: Cloudflare Workers & Figma

Cloudflare runs a significant portion of its edge-compute platform (Cloudflare
Workers) on WebAssembly. Rust is their recommended language for Workers that need
peak performance. Figma famously rewrote its multiplayer sync engine in Rust
compiled to Wasm, achieving a 3x performance improvement over the original
TypeScript implementation. In 2025, Fastly, Shopify, and ByteDance also run
Rust-compiled Wasm at the edge.

### Code snippet — image thumbnail generator compiled to Wasm

```rust
// src/lib.rs  — build with: wasm-pack build --target web
use wasm_bindgen::prelude::*;
use image::{DynamicImage, ImageFormat, imageops::FilterType};
use std::io::Cursor;

#[wasm_bindgen]
pub fn resize_image(input: &[u8], max_width: u32, max_height: u32) -> Vec<u8> {
    // Decode the incoming bytes (PNG / JPEG / etc.)
    let img = image::load_from_memory(input)
        .expect("Failed to decode image");

    // Maintain aspect ratio while fitting within bounds
    let thumbnail: DynamicImage = img.resize(max_width, max_height, FilterType::Lanczos3);

    // Encode back to PNG and return raw bytes to JavaScript
    let mut output = Cursor::new(Vec::new());
    thumbnail
        .write_to(&mut output, ImageFormat::Png)
        .expect("Failed to encode image");

    output.into_inner()
}
```

```javascript
// index.js — calling the Wasm module from the browser
import init, { resize_image } from "./pkg/image_resizer.js";

await init();

const response = await fetch("/photo.jpg");
const inputBytes = new Uint8Array(await response.arrayBuffer());

const outputBytes = resize_image(inputBytes, 320, 240);
const blob = new Blob([outputBytes], { type: "image/png" });
document.querySelector("img").src = URL.createObjectURL(blob);
```

### Pros

- **Near-native speed in the browser** — Rust + Wasm consistently outperforms
  JavaScript for CPU-bound tasks (image processing, video encoding, cryptography).
- **Strong Wasm ecosystem** — `wasm-bindgen`, `wasm-pack`, and `web-sys` provide
  polished, ergonomic bindings to Web APIs.
- **Sandboxed by default** — Wasm's capability model aligns perfectly with Rust's
  safety goals; memory is isolated from the host.
- **Edge compatibility** — Wasm modules are portable across Cloudflare, Fastly,
  and browser runtimes without recompilation.

### Cons

- **Binary size** — Rust Wasm binaries can be large; aggressive use of `wasm-opt`
  and `cargo` profile settings (LTO, `opt-level = "z"`) is needed to keep them
  small for web delivery.
- **Garbage-collected language interop** — passing complex JS objects to Rust
  requires serialization through `wasm-bindgen`, adding overhead and verbosity.
- **Debugging is harder** — source-map support is improving but stepping through
  Rust logic in browser DevTools is still less smooth than debugging JavaScript.
- **No direct DOM access** — all DOM manipulation must go through JS glue code,
  which can negate performance gains for DOM-heavy tasks.

---

## 3. Networking & High-Performance Servers — Web Frameworks and Proxies

### Real-world example: Discord, AWS (Firecracker), and Cloudflare (Pingora)

Discord migrated its Read States service from Go to Rust in 2020 and reported
latency dropping from milliseconds with occasional multi-second spikes to a flat
~500 µs with no spikes — while cutting memory usage by 10x. Cloudflare's **Pingora**
(open-sourced in 2024) is a Rust HTTP proxy framework that handles more than
1 trillion requests per day in production. AWS **Firecracker** is the Rust-based
VMM powering Lambda and Fargate.

### Code snippet — minimal HTTP API server with Axum

```rust
// src/main.rs
use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::Json,
    routing::{get, post},
    Router,
};
use serde::{Deserialize, Serialize};
use std::{collections::HashMap, sync::{Arc, RwLock}};
use tokio::net::TcpListener;

type Db = Arc<RwLock<HashMap<u64, User>>>;

#[derive(Debug, Clone, Serialize, Deserialize)]
struct User {
    id: u64,
    name: String,
    email: String,
}

#[tokio::main]
async fn main() {
    let db: Db = Arc::new(RwLock::new(HashMap::new()));

    let app = Router::new()
        .route("/users/:id", get(get_user))
        .route("/users", post(create_user))
        .with_state(db);

    let listener = TcpListener::bind("0.0.0.0:8080").await.unwrap();
    println!("Listening on http://0.0.0.0:8080");
    axum::serve(listener, app).await.unwrap();
}

async fn get_user(
    Path(id): Path<u64>,
    State(db): State<Db>,
) -> Result<Json<User>, StatusCode> {
    let db = db.read().unwrap();
    db.get(&id)
        .cloned()
        .map(Json)
        .ok_or(StatusCode::NOT_FOUND)
}

async fn create_user(
    State(db): State<Db>,
    Json(user): Json<User>,
) -> (StatusCode, Json<User>) {
    let mut db = db.write().unwrap();
    db.insert(user.id, user.clone());
    (StatusCode::CREATED, Json(user))
}
```

### Pros

- **Predictable, low latency** — no garbage-collector pauses means tail latencies
  are dramatically lower compared to Go, Java, or Node.js services.
- **Efficient async I/O** — Tokio's work-stealing scheduler with zero-cost futures
  lets a single server handle hundreds of thousands of concurrent connections.
- **Memory efficiency** — Rust services consistently use a fraction of the RAM
  that equivalent JVM or Go services require, reducing cloud bills at scale.
- **Type-safe routing and middleware** — frameworks like Axum leverage Rust's type
  system to catch handler signature mismatches at compile time.

### Cons

- **Async complexity** — `async`/`await` in Rust is more intricate than in Go or
  Node.js; lifetime issues inside async blocks are a frequent stumbling block.
- **Slower iteration speed** — compile times and the borrow checker slow down
  rapid prototyping compared to dynamic languages.
- **Smaller ecosystem** — while growing fast, crates for databases, auth, and
  observability are fewer and less mature than npm or Maven equivalents.
- **Hiring is harder** — the pool of experienced async Rust engineers is smaller,
  raising team-building costs.

---

## 4. Embedded Systems — Microcontrollers and Real-Time Firmware

### Real-world example: Espressif (ESP32), Google (OpenTitan), and Oxide Computer

Espressif officially supports Rust for its ESP32 family of chips. Google's
**OpenTitan** silicon root-of-trust project uses Rust for firmware. **Oxide
Computer Company** built its entire server management firmware stack in Rust,
running bare-metal on ARM Cortex-M microcontrollers. In 2025 the `embassy`
async embedded framework has seen wide production adoption for building
`no_std` firmware with cooperative multitasking.

### Code snippet — async LED blinker with Embassy on a Cortex-M4

```rust
// src/main.rs  (targets STM32F4 via embassy-stm32)
#![no_std]
#![no_main]

use embassy_executor::Spawner;
use embassy_stm32::gpio::{Level, Output, Speed};
use embassy_time::{Duration, Timer};
use {defmt_rtt as _, panic_probe as _};

#[embassy_executor::main]
async fn main(_spawner: Spawner) {
    let p = embassy_stm32::init(Default::default());

    // PA5 is the onboard LED on many Nucleo-F4 boards
    let mut led = Output::new(p.PA5, Level::Low, Speed::Low);

    loop {
        led.set_high();
        Timer::after(Duration::from_millis(500)).await;

        led.set_low();
        Timer::after(Duration::from_millis(500)).await;
    }
}
```

```toml
# Cargo.toml (relevant dependencies)
[dependencies]
embassy-executor  = { version = "0.6", features = ["arch-cortex-m", "executor-thread"] }
embassy-stm32     = { version = "0.1", features = ["stm32f411re", "time-driver-tim2"] }
embassy-time      = { version = "0.3" }
defmt             = "0.3"
defmt-rtt         = "0.4"
panic-probe       = { version = "0.3", features = ["print-defmt"] }
cortex-m-rt       = "0.7"
```

### Pros

- **`no_std` + `no_main`** — Rust can run entirely without an OS or allocator,
  making it suitable for the smallest microcontrollers (tens of kilobytes of flash).
- **Compile-time peripheral exclusivity** — the type system enforces that a
  peripheral (e.g., a UART) can only be used by one owner at a time, preventing
  hardware resource conflicts without runtime locks.
- **Async without an RTOS** — Embassy's cooperative async executor provides
  structured concurrency on bare metal, eliminating the need for FreeRTOS or Zephyr
  in many cases.
- **Memory safety in safety-critical code** — no buffer overflows or dangling
  pointers in firmware that may run in medical devices or automotive systems.

### Cons

- **Hardware Abstraction Layer (HAL) coverage gaps** — not every chip has a
  mature, complete Rust HAL; developers may need to write raw register access code
  for exotic peripherals.
- **Debugging tooling** — while `probe-rs` has matured significantly, the
  debugging experience is still not as polished as vendor IDEs (Keil, IAR, STM32CubeIDE).
- **`unsafe` at the boundaries** — any direct hardware register access or DMA
  setup requires `unsafe` blocks, partially defeating the safety story.
- **Binary size overhead** — Rust's monomorphization can bloat flash usage more
  than equivalent C, which matters on 32 KB flash devices.

---

## 5. Command-Line Tools & Developer Tooling

### Real-world example: ripgrep, bat, fd, and Ruff (Astral)

The Rust CLI ecosystem has become a benchmark for performance. **ripgrep** (`rg`)
by Andrew Gallant is dramatically faster than GNU grep and is used by VS Code as
its default search backend. **Ruff**, the Python linter and formatter by Astral,
is written in Rust and is 10–100x faster than Flake8 or Black on large codebases.
It has become the de facto linter for major Python projects (FastAPI, Pandas,
Jupyter) in 2025. **Biome** (formerly Rome) does the same for JavaScript tooling.

### Code snippet — a concurrent file word-count CLI tool

```rust
// src/main.rs — build with: cargo build --release
// Usage: wordcount <file1> [file2 ...]
use rayon::prelude::*;
use std::{
    collections::HashMap,
    env,
    fs,
    path::PathBuf,
};

#[derive(Debug)]
struct FileStats {
    path: PathBuf,
    lines: usize,
    words: usize,
    bytes: usize,
}

fn count_file(path: PathBuf) -> std::io::Result<FileStats> {
    let content = fs::read_to_string(&path)?;
    Ok(FileStats {
        lines: content.lines().count(),
        words: content.split_whitespace().count(),
        bytes: content.len(),
        path,
    })
}

fn main() {
    let paths: Vec<PathBuf> = env::args().skip(1).map(PathBuf::from).collect();

    if paths.is_empty() {
        eprintln!("Usage: wordcount <file> [files...]");
        std::process::exit(1);
    }

    // Process all files in parallel using Rayon
    let results: Vec<FileStats> = paths
        .into_par_iter()
        .filter_map(|p| {
            count_file(p.clone())
                .map_err(|e| eprintln!("Error reading {}: {e}", p.display()))
                .ok()
        })
        .collect();

    println!("{:<8} {:<8} {:<8} {}", "Lines", "Words", "Bytes", "File");
    println!("{}", "-".repeat(50));

    let (mut tl, mut tw, mut tb) = (0, 0, 0);
    for stat in &results {
        println!(
            "{:<8} {:<8} {:<8} {}",
            stat.lines,
            stat.words,
            stat.bytes,
            stat.path.display()
        );
        tl += stat.lines;
        tw += stat.words;
        tb += stat.bytes;
    }

    if results.len() > 1 {
        println!("{}", "-".repeat(50));
        println!("{:<8} {:<8} {:<8} total", tl, tw, tb);
    }
}
```

### Pros

- **Outstanding performance** — Rust binaries are native code with no VM or
  interpreter overhead; memory-mapped I/O and SIMD (via crates like `memchr`)
  make operations like search extremely fast.
- **Single static binary** — `cargo build --release` produces a fully self-
  contained executable with no runtime dependency, simplifying distribution via
  GitHub Releases, Homebrew, or `cargo install`.
- **Rich CLI library ecosystem** — `clap` (argument parsing), `indicatif`
  (progress bars), `crossterm` / `ratatui` (TUI), `dialoguer` (interactive
  prompts) provide everything needed for polished tools.
- **Cross-compilation is straightforward** — one `rustup target add` command and
  a cross-compilation target lets you ship binaries for Linux, macOS, and Windows
  from a single CI runner.

### Cons

- **Longer compile times hurt iteration** — even moderate CLI tools can take
  10–30 seconds to compile in release mode, which slows the edit-compile-test
  cycle compared to Python or Go.
- **Overkill for simple scripts** — a two-page Python script is often the right
  tool; reaching for Rust adds unnecessary build infrastructure for trivial tasks.
- **Error handling verbosity** — propagating errors through `Result<T, E>` with
  `?` and custom error types (or `anyhow` / `thiserror`) requires more boilerplate
  than exception-based languages.
- **Dependency compile times accumulate** — popular crates like `clap` or `tokio`
  add compile-time cost; the Rust ecosystem lacks a pre-built shared library model.

---

## Summary Table

| Use Case              | Key Companies / Projects          | Core Crates / Tooling                        |
|-----------------------|-----------------------------------|----------------------------------------------|
| Systems / Kernel      | Linux kernel, Microsoft, Oxide    | `kernel` crate, `libc`, bare `unsafe` FFI    |
| WebAssembly           | Cloudflare, Figma, Fastly         | `wasm-bindgen`, `wasm-pack`, `web-sys`       |
| Networking / Servers  | Discord, Cloudflare (Pingora), AWS| `tokio`, `axum`, `hyper`, `tower`            |
| Embedded Systems      | Espressif, Google, Oxide          | `embassy`, `probe-rs`, `cortex-m`, HAL crates|
| CLI / Developer Tools | ripgrep, Ruff, Biome, bat         | `clap`, `rayon`, `indicatif`, `anyhow`       |

---

## Conclusion

Rust's value proposition in 2025 centres on three pillars: **memory safety without
a GC, predictable performance, and fearless concurrency**. It shines brightest in
contexts where C or C++ would traditionally be required but where memory-safety bugs
carry serious consequences (kernel code, firmware, high-traffic network proxies).
The main recurring trade-off is **developer velocity** — Rust's compile times and
its ownership model exact a real upfront cost that teams must weigh against long-
term maintenance savings from eliminated bug classes.

For greenfield projects where correctness, latency, or resource efficiency is a
primary constraint, Rust is an increasingly compelling default choice in 2025.

---

*Sources: Rust 2024 Annual Survey results, Cloudflare Engineering Blog (Pingora),
Discord Engineering Blog, Linux kernel git history (v6.1–v6.8), Oxide Computer
engineering blog, Astral/Ruff GitHub repository, Figma Engineering Blog.*
