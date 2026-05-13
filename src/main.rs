use std::time::Duration;
use rand::Rng;
use tokio::time::sleep;

// --- Config ---
const LENGTH: usize = 1000;
const INTERVAL_MS: u64 = 500;
const CHARS: &[u8] = b"abcdefghijklmnopqrstuvwxyz";
const URL: &str = "https://script.google.com/macros/s/AKfycbyl8Pzkch8mEKpdIWYU8Tp6TlGc5X0xih5isHb5lM_z6f7o8qyFxkTs_g2nzzcrz0io/exec";

fn random_str(len: usize) -> String {
    let mut rng = rand::thread_rng();
    (0..len)
        .map(|_| CHARS[rng.gen_range(0..CHARS.len())] as char)
        .collect()
}

#[tokio::main]
async fn main() {
    let client = reqwest::Client::new();

    loop {
        let value = random_str(LENGTH);
        let body = format!(
            "username={}&email={}%40g.com&password={}",
            value, value, value
        );

        match client
            .post(URL)
            .header("accept", "*/*")
            .header("accept-language", "en-US,en;q=0.6")
            .header("content-type", "application/x-www-form-urlencoded;charset=UTF-8")
            .body(body)
            .send()
            .await
        {
            Ok(res) => {
                let text = res.text().await.unwrap_or_else(|_| "(no body)".to_string());
                println!("[{}] value: {} | response: {}", chrono::Local::now().format("%H:%M:%S"), value, text);
            }
            Err(e) => eprintln!("Error: {}", e),
        }

        sleep(Duration::from_millis(INTERVAL_MS)).await;
    }
}
