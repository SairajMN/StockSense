// StockSense Authentication View (Split-Screen Kraft Ledger Theme)
import { store } from '../store.js';
import { showToast } from '../modals.js';

export function renderAuthView(container, initialTab = 'login') {
  container.innerHTML = `
    <div class="min-h-screen w-full flex flex-col lg:flex-row bg-[#fdf9f4] text-[#1c1c19]">
      <!-- LEFT BRAND PANEL (~45% width) -->
      <aside class="relative w-full lg:w-[45%] bg-[#b84328] text-[#fdf9f4] flex flex-col justify-between p-8 sm:p-12 lg:p-14 overflow-hidden border-b lg:border-b-0 lg:border-r border-[#972b12]">
        <!-- Subtle Aged Kraft Texture & Grid Overlay -->
        <div class="absolute inset-0 opacity-10 pointer-events-none" style="background-image: radial-gradient(#fdf9f4 1px, transparent 1px); background-size: 24px 24px;"></div>
        <div class="absolute -right-20 -bottom-20 w-96 h-96 rounded-full border border-[#fdf9f4]/15 pointer-events-none"></div>

        <!-- Top Left: Brand Header -->
        <div class="relative z-10 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center w-10 h-10 rounded border border-[#fdf9f4]/40 bg-[#fdf9f4]/10 text-[#fdf9f4] backdrop-blur-sm">
              <span class="material-symbols-outlined text-[24px]">inventory_2</span>
            </div>
            <div class="flex flex-col">
              <span class="font-mono text-xl uppercase tracking-wider text-[#fdf9f4] font-bold">STOCKSENSE</span>
              <span class="font-mono text-[10px] tracking-widest text-[#fdf9f4]/75 uppercase">Inventory Management System</span>
            </div>
          </div>
          <div class="px-2.5 py-1 rounded border border-[#fdf9f4]/30 font-mono text-[11px] tracking-widest uppercase text-[#fdf9f4]/80">
            SYSTEM v2.4
          </div>
        </div>

        <!-- Center: Headline, Tagline & Technical Line Art Vector -->
        <div class="relative z-10 my-10 lg:my-auto flex flex-col gap-6">
          <div class="space-y-2">
            <div class="inline-flex items-center gap-2 font-mono text-[11px] text-[#fdf9f4]/80 tracking-widest uppercase">
              <span class="w-2 h-2 rounded-full bg-[#fdf9f4] inline-block animate-pulse"></span>
              WAREHOUSE INVENTORY &amp; STOCK MANAGEMENT
            </div>
            <h1 class="font-mono text-2xl sm:text-3xl lg:text-[34px] leading-tight text-[#fdf9f4] uppercase font-bold tracking-tight">
              Track every unit, every location, in real time.
            </h1>
          </div>

          <!-- Technical Warehouse Vector Illustration (Storage Racks, Pallets & Pallet Jack) -->
          <div class="w-full max-w-md pt-2">
            <svg class="w-full h-auto text-[#fdf9f4] drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 420 220" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 15h12M16 9v12M400 15h12M406 9v12M10 205h12M16 199v12M400 205h12M406 199v12" opacity="0.4" stroke-width="1"></path>
              <line opacity="0.75" stroke-dasharray="3 3" stroke-width="1.5" x1="40" x2="40" y1="20" y2="200"></line>
              <line opacity="0.9" stroke-width="2" x1="46" x2="46" y1="20" y2="200"></line>
              <line opacity="0.75" stroke-dasharray="3 3" stroke-width="1.5" x1="160" x2="160" y1="20" y2="200"></line>
              <line opacity="0.9" stroke-width="2" x1="166" x2="166" y1="20" y2="200"></line>
              <line opacity="0.75" stroke-dasharray="3 3" stroke-width="1.5" x1="280" x2="280" y1="20" y2="200"></line>
              <line opacity="0.9" stroke-width="2" x1="286" x2="286" y1="20" y2="200"></line>
              <rect height="6" opacity="0.95" rx="1" stroke-width="1.5" width="250" x="40" y="70"></rect>
              <rect height="6" opacity="0.95" rx="1" stroke-width="1.5" width="250" x="40" y="130"></rect>
              <rect height="6" opacity="0.95" rx="1" stroke-width="1.5" width="250" x="40" y="190"></rect>
              <rect height="36" opacity="0.85" rx="1" stroke-width="1.5" width="46" x="58" y="34"></rect>
              <line opacity="0.6" stroke-width="1" x1="58" x2="104" y1="34" y2="70"></line>
              <line opacity="0.6" stroke-width="1" x1="104" x2="58" y1="34" y2="70"></line>
              <rect height="28" opacity="0.85" rx="1" stroke-width="1.5" width="38" x="110" y="42"></rect>
              <rect height="40" opacity="0.9" rx="1" stroke-width="1.5" width="46" x="178" y="90"></rect>
              <line opacity="0.7" stroke-width="1" x1="178" x2="224" y1="90" y2="130"></line>
              <rect height="8" opacity="0.9" rx="1" stroke-width="1.5" width="90" x="58" y="182"></rect>
              <rect height="44" opacity="0.95" rx="1" stroke-width="1.5" width="84" x="61" y="138"></rect>
              <text fill="currentColor" font-family="Courier Prime" font-size="8" letter-spacing="1" opacity="0.8" stroke="none" x="84" y="153">BAY-01</text>
              <g transform="translate(290, 130)">
                <path d="M10 58 L85 58 L85 52 L15 52 Z" opacity="0.9" stroke-width="1.5"></path>
                <circle cx="80" cy="62" opacity="0.9" r="4" stroke-width="1.5"></circle>
                <circle cx="16" cy="62" opacity="0.9" r="5" stroke-width="1.5"></circle>
                <rect height="22" opacity="0.9" rx="1" stroke-width="1.5" width="14" x="8" y="30"></rect>
                <line opacity="0.9" stroke-width="2" x1="14" x2="2" y1="32" y2="4"></line>
                <circle cx="2" cy="4" opacity="0.8" r="2.5" stroke-width="1"></circle>
                <rect height="26" opacity="0.8" rx="1" stroke-width="1.5" width="48" x="32" y="26"></rect>
              </g>
              <line opacity="0.6" stroke-width="1.5" x1="20" x2="400" y1="200" y2="200"></line>
            </svg>
          </div>

          <div class="font-mono text-xs text-[#fdf9f4]/80 space-y-1">
            <p>• Automated barcode &amp; location tracking</p>
            <p>• Multi-location receipts, deliveries, and internal transfers</p>
          </div>
        </div>

        <!-- Bottom: System Status Footer -->
        <div class="relative z-10 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono text-[#fdf9f4]/75 border-t border-[#fdf9f4]/20">
          <span class="tracking-widest uppercase">StockSense System • Release 2.4</span>
          <span class="tracking-widest opacity-80 uppercase">SYSTEM STATUS: ONLINE</span>
        </div>
      </aside>

      <!-- RIGHT FORM PANEL (~55% width) -->
      <section class="flex-1 bg-[#f7f3ee] min-h-screen flex flex-col justify-between overflow-y-auto selection:bg-[#ffdad2] selection:text-[#3d0600]">
        <!-- Header Utility Bar -->
        <div class="w-full max-w-xl mx-auto px-6 pt-6 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-none bg-[#536443]"></span>
            <span class="font-mono text-xs text-[#536443] font-bold uppercase tracking-wider">SECURE ACCESS</span>
          </div>
          <div class="flex items-center gap-2 font-mono text-xs text-[#58413c]">
            <span id="auth-alt-text">Don't have an account?</span>
            <button id="auth-alt-btn" class="text-[#b84328] hover:underline font-bold uppercase cursor-pointer">Sign Up</button>
          </div>
        </div>

        <!-- Centered Authentication Form Container -->
        <main class="w-full max-w-xl mx-auto px-6 py-8 my-auto flex flex-col items-center justify-center">
          <div class="w-full">
            <!-- Tabs Container -->
            <div id="tabs-container" class="relative z-10 flex items-end justify-start px-2 gap-1 font-mono text-xs">
              <button id="tab-btn-login" class="px-5 py-2 rounded-t-sm font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer">
                <span class="w-2 h-2 rounded-full inline-block"></span>
                <span>[ Sign In ]</span>
              </button>
              <button id="tab-btn-signup" class="px-5 py-2 rounded-t-sm font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer">
                <span class="w-2 h-2 rounded-full inline-block"></span>
                <span>[ Sign Up ]</span>
              </button>
            </div>

            <!-- Physical Paper Manifest Sheet Card -->
            <div class="relative z-20 bg-white shadow-md border border-[#cfc5b4] p-6 sm:p-8 md:p-10 rounded-xs">
              <!-- Perforated Stub Line -->
              <div class="w-full pb-3 mb-4 opacity-50 select-none overflow-hidden">
                <span class="font-mono text-[10px] text-[#8c716b] tracking-widest whitespace-nowrap">
                  - - - - - KRAFT LEDGER USER REGISTRATION &amp; AUTHENTICATION RULE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                </span>
              </div>

              <!-- Main Auth Container -->
              <div id="auth-main-panel">
                <!-- Header Block -->
                <div class="flex flex-col pb-4 mb-5 border-b border-[#cfc5b4]/60">
                  <h2 id="auth-form-title" class="font-mono text-2xl font-bold uppercase text-[#262421] tracking-tight">SIGN IN</h2>
                  <p id="auth-form-subtitle" class="font-body text-sm text-[#58413c] mt-1">Enter your credentials to access your account.</p>
                </div>

                <!-- 1. LOGIN FORM (Exactly: Login ID, Password, Sign In button, Forgot Password? and Sign Up links) -->
                <form id="login-form" class="flex flex-col gap-4">
                  <!-- General Login Error Container -->
                  <div id="login-error-msg" class="p-3 bg-[#ffdad6] border border-[#ba1a1a] text-[#ba1a1a] font-mono text-xs font-bold hidden leading-relaxed">
                    Invalid Login Id or Password.
                  </div>

                  <!-- Login ID -->
                  <div class="flex flex-col gap-1">
                    <label class="font-mono text-xs uppercase text-[#262421] font-bold tracking-wider" for="login-id">
                      Login ID
                    </label>
                    <input id="login-id" type="text" autocomplete="username" required placeholder="Enter Login ID"
                      class="w-full bg-[#fdf9f4] border border-[#cfc5b4] rounded-none p-2.5 font-mono text-sm text-[#262421] focus:outline-none focus:border-[#b84328]" />
                    <div id="login-id-error" class="text-[11px] font-mono text-[#ba1a1a] font-bold hidden"></div>
                  </div>

                  <!-- Password (with show/hide toggle) -->
                  <div class="flex flex-col gap-1">
                    <div class="flex items-center justify-between">
                      <label class="font-mono text-xs uppercase text-[#262421] font-bold tracking-wider" for="login-password">
                        Password
                      </label>
                      <button id="toggle-login-pwd" type="button" class="font-mono text-xs text-[#b84328] uppercase hover:underline flex items-center gap-1 cursor-pointer">
                        <span class="material-symbols-outlined text-[15px]" id="login-pwd-icon">visibility</span>
                        <span id="login-pwd-text">SHOW</span>
                      </button>
                    </div>
                    <input id="login-password" type="password" autocomplete="current-password" required placeholder="••••••••••••"
                      class="w-full bg-[#fdf9f4] border border-[#cfc5b4] rounded-none p-2.5 font-mono text-sm text-[#262421] focus:outline-none focus:border-[#b84328] tracking-widest" />
                    <div id="login-password-error" class="text-[11px] font-mono text-[#ba1a1a] font-bold hidden"></div>
                  </div>

                  <!-- Demo Credentials Quick Helper Box -->
                  <div class="p-2.5 bg-[#efe9dc] border border-[#cfc5b4] font-mono text-[11px] text-[#58413c] flex flex-col gap-1 select-none">
                    <div class="flex items-center justify-between">
                      <span class="font-bold text-[#262421] uppercase flex items-center gap-1">
                        <span class="w-1.5 h-1.5 bg-[#536443] inline-block"></span>
                        <span>DEMO CREDENTIALS:</span>
                      </span>
                      <button type="button" id="btn-fill-demo" class="text-[#b84328] hover:underline font-bold uppercase cursor-pointer">
                        [ AUTO-FILL ]
                      </button>
                    </div>
                    <div class="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px]">
                      <span>Login ID: <strong class="text-[#262421]">demo_admin</strong></span>
                      <span>Password: <strong class="text-[#262421]">StockSense2026!</strong></span>
                    </div>
                  </div>

                  <!-- Submit Button: "Sign In" -->
                  <div class="pt-1">
                    <button id="btn-login-submit" type="submit"
                      class="w-full py-3 px-6 rounded-none bg-[#b84328] hover:bg-[#972b12] text-white font-mono text-sm font-bold uppercase tracking-wider shadow-sm transform -rotate-[0.5deg] hover:rotate-0 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer">
                      <span class="material-symbols-outlined text-[18px]">login</span>
                      <span>Sign In</span>
                    </button>
                  </div>

                  <!-- Links: "Forgot Password?" and "Sign Up" -->
                  <div class="flex items-center justify-between pt-2 border-t border-dashed border-[#cfc5b4]/60 font-mono text-xs">
                    <button type="button" id="btn-forgot-password" class="text-[#b84328] font-bold hover:underline uppercase cursor-pointer">
                      Forgot Password?
                    </button>
                    <button type="button" id="link-goto-signup" class="text-[#58413c] font-bold hover:underline uppercase cursor-pointer">
                      Sign Up
                    </button>
                  </div>
                </form>

                <!-- 2. SIGN UP FORM (Exactly: Login ID, Email ID, Password with toggle, Re-Enter Password, Sign Up button) -->
                <form id="signup-form" class="flex flex-col gap-4 hidden">
                  <!-- Login ID -->
                  <div class="flex flex-col gap-1">
                    <label class="font-mono text-xs uppercase text-[#262421] font-bold tracking-wider" for="signup-login-id">
                      Login ID
                    </label>
                    <input id="signup-login-id" type="text" autocomplete="username" placeholder="6–12 characters"
                      class="w-full bg-[#fdf9f4] border border-[#cfc5b4] rounded-none p-2.5 font-mono text-sm text-[#262421] focus:outline-none focus:border-[#b84328]" />
                    <div id="signup-login-id-error" class="text-[11px] font-mono text-[#ba1a1a] font-bold hidden"></div>
                  </div>

                  <!-- Email ID -->
                  <div class="flex flex-col gap-1">
                    <label class="font-mono text-xs uppercase text-[#262421] font-bold tracking-wider" for="signup-email">
                      Email ID
                    </label>
                    <input id="signup-email" type="email" autocomplete="email" placeholder="name@example.com"
                      class="w-full bg-[#fdf9f4] border border-[#cfc5b4] rounded-none p-2.5 font-mono text-sm text-[#262421] focus:outline-none focus:border-[#b84328]" />
                    <div id="signup-email-error" class="text-[11px] font-mono text-[#ba1a1a] font-bold hidden"></div>
                  </div>

                  <!-- Password (with show/hide toggle) -->
                  <div class="flex flex-col gap-1">
                    <div class="flex items-center justify-between">
                      <label class="font-mono text-xs uppercase text-[#262421] font-bold tracking-wider" for="signup-password">
                        Password
                      </label>
                      <button id="toggle-signup-pwd" type="button" class="font-mono text-xs text-[#b84328] uppercase hover:underline flex items-center gap-1 cursor-pointer">
                        <span class="material-symbols-outlined text-[15px]" id="signup-pwd-icon">visibility</span>
                        <span id="signup-pwd-text">SHOW</span>
                      </button>
                    </div>
                    <input id="signup-password" type="password" autocomplete="new-password" placeholder="Min. 9 characters, uppercase, lowercase, special character"
                      class="w-full bg-[#fdf9f4] border border-[#cfc5b4] rounded-none p-2.5 font-mono text-sm text-[#262421] focus:outline-none focus:border-[#b84328] tracking-widest" />
                    <div id="signup-password-error" class="text-[11px] font-mono text-[#ba1a1a] font-bold hidden leading-relaxed"></div>
                  </div>

                  <!-- Re-Enter Password -->
                  <div class="flex flex-col gap-1">
                    <label class="font-mono text-xs uppercase text-[#262421] font-bold tracking-wider" for="signup-confirm-password">
                      Re-Enter Password
                    </label>
                    <input id="signup-confirm-password" type="password" autocomplete="new-password" placeholder="Re-enter your password"
                      class="w-full bg-[#fdf9f4] border border-[#cfc5b4] rounded-none p-2.5 font-mono text-sm text-[#262421] focus:outline-none focus:border-[#b84328] tracking-widest" />
                    <div id="signup-confirm-password-error" class="text-[11px] font-mono text-[#ba1a1a] font-bold hidden"></div>
                  </div>

                  <!-- Submit Button: "Sign Up" -->
                  <div class="pt-2">
                    <button id="btn-signup-submit" type="submit"
                      class="w-full py-3 px-6 rounded-none bg-[#b84328] hover:bg-[#972b12] text-white font-mono text-sm font-bold uppercase tracking-wider shadow-sm transform -rotate-[0.5deg] hover:rotate-0 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer">
                      <span class="material-symbols-outlined text-[18px]">person_add</span>
                      <span>Sign Up</span>
                    </button>
                  </div>

                  <!-- Already have account link -->
                  <div class="text-center pt-2 border-t border-dashed border-[#cfc5b4]/60 font-mono text-xs text-[#58413c]">
                    Already have an account?
                    <button type="button" id="link-goto-login" class="text-[#b84328] font-bold hover:underline uppercase cursor-pointer ml-1">
                      Sign In
                    </button>
                  </div>
                </form>
              </div>

              <!-- OTP-Based Password Reset 3-Step Panel (P0.2) -->
              <div id="reset-panel" class="hidden">
                <div class="flex flex-col pb-4 mb-5 border-b border-[#cfc5b4]/60">
                  <div class="flex items-center justify-between">
                    <h2 class="font-mono text-xl font-bold uppercase text-[#262421] tracking-tight">PASSWORD RESET // OTP</h2>
                    <span id="otp-step-indicator" class="font-mono text-[10px] bg-[#d3e6bd]/40 border border-[#536443]/40 text-[#536443] px-2 py-0.5 font-bold uppercase">
                      STEP 1 OF 3
                    </span>
                  </div>
                  <p id="otp-step-desc" class="font-body text-xs text-[#58413c] mt-1">
                    Enter your registered email address to receive a 6-digit OTP verification code.
                  </p>
                </div>

                <!-- OTP Simulated Toast / Display Banner -->
                <div id="otp-display-banner" class="hidden p-3 bg-[#faf7f0] border-2 border-[#536443] mb-4 font-mono text-xs">
                  <div class="flex items-center justify-between">
                    <span class="text-[#536443] font-bold uppercase flex items-center gap-1">
                      <span class="material-symbols-outlined text-[16px]">key</span>
                      <span>VERIFICATION CODE GENERATED:</span>
                    </span>
                    <strong id="mock-otp-code" class="text-base text-[#b84328] tracking-widest font-mono">000000</strong>
                  </div>
                  <div class="text-[10px] text-[#58413c] mt-1">Verification OTP generated for demonstration. Valid for 10 minutes.</div>
                </div>

                <!-- Step 1: Request Email -->
                <div id="reset-step-1" class="space-y-4 font-mono text-xs">
                  <div>
                    <label class="block text-[#565145] font-bold mb-1 uppercase">EMAIL ID:</label>
                    <input type="email" id="reset-email" placeholder="name@example.com"
                      class="w-full bg-[#fdf9f4] border border-[#cfc5b4] p-2.5 text-[#262421] font-bold focus:border-[#b84328] focus:outline-none" />
                  </div>
                  <button id="btn-request-otp" class="w-full py-2.5 bg-[#b84328] hover:bg-[#972b12] text-white font-bold uppercase tracking-wider cursor-pointer">
                    REQUEST 6-DIGIT OTP CODE
                  </button>
                </div>

                <!-- Step 2: Enter 6-digit OTP -->
                <div id="reset-step-2" class="hidden space-y-4 font-mono text-xs">
                  <div>
                    <label class="block text-[#565145] font-bold mb-1 uppercase">ENTER 6-DIGIT VERIFICATION CODE:</label>
                    <input type="text" id="reset-otp-input" maxlength="6" placeholder="######"
                      class="w-full bg-[#fdf9f4] border border-[#cfc5b4] p-2.5 text-[#262421] font-bold text-center tracking-widest text-lg focus:border-[#b84328] focus:outline-none" />
                  </div>
                  <button id="btn-verify-otp" class="w-full py-2.5 bg-[#536443] hover:bg-[#3b4c2d] text-white font-bold uppercase tracking-wider cursor-pointer">
                    VERIFY CODE &amp; CONTINUE
                  </button>
                </div>

                <!-- Step 3: Enter New Password -->
                <div id="reset-step-3" class="hidden space-y-4 font-mono text-xs">
                  <div>
                    <label class="block text-[#565145] font-bold mb-1 uppercase">NEW PASSWORD:</label>
                    <input type="password" id="reset-new-pwd" placeholder="Min. 9 characters, uppercase, lowercase, symbol"
                      class="w-full bg-[#fdf9f4] border border-[#cfc5b4] p-2.5 text-[#262421] font-bold tracking-widest focus:border-[#b84328] focus:outline-none" />
                  </div>
                  <button id="btn-save-new-pwd" class="w-full py-2.5 bg-[#b84328] hover:bg-[#972b12] text-white font-bold uppercase tracking-wider cursor-pointer">
                    UPDATE PASSWORD &amp; SIGN IN
                  </button>
                </div>

                <div class="mt-4 pt-3 border-t border-dashed border-[#cfc5b4] flex items-center justify-between text-xs font-mono">
                  <button id="btn-cancel-reset" class="text-[#565145] hover:text-[#b84328] font-bold uppercase cursor-pointer">
                    ← RETURN TO SIGN IN
                  </button>
                </div>
              </div>

              <!-- Footer note -->
              <div class="mt-6 pt-4 border-t border-dashed border-[#cfc5b4] flex items-center justify-between text-[11px] font-mono text-[#58413c]">
                <span>STOCKSENSE IDENTITY ACCESS</span>
                <span class="text-[#536443] font-bold">SYSTEM ACTIVE</span>
              </div>
            </div>
          </div>
        </main>

        <!-- Footer -->
        <footer class="w-full max-w-xl mx-auto px-6 py-6 border-t border-[#cfc5b4]/50 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[11px] text-[#58413c] uppercase">
          <div>© 2026 STOCKSENSE LOGISTICS INC.</div>
          <div class="flex items-center gap-3">
            <span class="hover:underline cursor-pointer">PRIVACY</span>
            <span>•</span>
            <span class="hover:underline cursor-pointer">TERMS</span>
            <span>•</span>
            <span class="hover:underline cursor-pointer">DOCS</span>
          </div>
        </footer>
      </section>
    </div>
  `;

  // UI Elements
  const tabLogin = document.getElementById('tab-btn-login');
  const tabSignup = document.getElementById('tab-btn-signup');
  const formTitle = document.getElementById('auth-form-title');
  const formSubtitle = document.getElementById('auth-form-subtitle');
  const altText = document.getElementById('auth-alt-text');
  const altBtn = document.getElementById('auth-alt-btn');
  const authMainPanel = document.getElementById('auth-main-panel');
  const resetPanel = document.getElementById('reset-panel');
  const tabsContainer = document.getElementById('tabs-container');

  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');

  // Login Form Elements
  const loginIdInput = document.getElementById('login-id');
  const loginPasswordInput = document.getElementById('login-password');
  const loginErrorMsg = document.getElementById('login-error-msg');
  const toggleLoginPwdBtn = document.getElementById('toggle-login-pwd');
  const loginPwdIcon = document.getElementById('login-pwd-icon');
  const loginPwdText = document.getElementById('login-pwd-text');
  const btnForgotPwd = document.getElementById('btn-forgot-password');
  const linkGotoSignup = document.getElementById('link-goto-signup');

  // Sign Up Form Elements
  const signupLoginIdInput = document.getElementById('signup-login-id');
  const signupLoginIdError = document.getElementById('signup-login-id-error');
  const signupEmailInput = document.getElementById('signup-email');
  const signupEmailError = document.getElementById('signup-email-error');
  const signupPasswordInput = document.getElementById('signup-password');
  const signupPasswordError = document.getElementById('signup-password-error');
  const signupConfirmPasswordInput = document.getElementById('signup-confirm-password');
  const signupConfirmPasswordError = document.getElementById('signup-confirm-password-error');
  const toggleSignupPwdBtn = document.getElementById('toggle-signup-pwd');
  const signupPwdIcon = document.getElementById('signup-pwd-icon');
  const signupPwdText = document.getElementById('signup-pwd-text');
  const linkGotoLogin = document.getElementById('link-goto-login');

  let currentMode = initialTab;

  function setMode(mode) {
    currentMode = mode;
    authMainPanel.classList.remove('hidden');
    resetPanel.classList.add('hidden');
    tabsContainer.classList.remove('hidden');

    // Reset errors
    clearLoginErrors();
    clearSignupErrors();

    if (mode === 'signup') {
      tabSignup.className = "px-5 py-2 rounded-t-sm font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer bg-white text-[#b84328] shadow-sm border-t border-l border-r border-[#cfc5b4]";
      tabSignup.querySelector('span:first-child').className = "w-2 h-2 rounded-full inline-block bg-[#b84328]";

      tabLogin.className = "px-5 py-2 rounded-t-sm font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer bg-[#e6e2dd] text-[#58413c] hover:bg-[#ddd9d5]";
      tabLogin.querySelector('span:first-child').className = "w-2 h-2 rounded-full inline-block bg-[#cfc5b4]";

      loginForm.classList.add('hidden');
      signupForm.classList.remove('hidden');

      formTitle.textContent = "SIGN UP";
      formSubtitle.textContent = "Fill in your details below to create your account.";
      altText.textContent = "Already have an account?";
      altBtn.textContent = "Sign In";
    } else {
      tabLogin.className = "px-5 py-2 rounded-t-sm font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer bg-white text-[#b84328] shadow-sm border-t border-l border-r border-[#cfc5b4]";
      tabLogin.querySelector('span:first-child').className = "w-2 h-2 rounded-full inline-block bg-[#b84328]";

      tabSignup.className = "px-5 py-2 rounded-t-sm font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer bg-[#e6e2dd] text-[#58413c] hover:bg-[#ddd9d5]";
      tabSignup.querySelector('span:first-child').className = "w-2 h-2 rounded-full inline-block bg-[#cfc5b4]";

      signupForm.classList.add('hidden');
      loginForm.classList.remove('hidden');

      formTitle.textContent = "SIGN IN";
      formSubtitle.textContent = "Enter your credentials to access your account.";
      altText.textContent = "Don't have an account?";
      altBtn.textContent = "Sign Up";
    }
  }

  function setFieldError(input, errorEl, message) {
    if (message) {
      errorEl.textContent = message;
      errorEl.classList.remove('hidden');
      input.classList.add('border-[#ba1a1a]');
      input.classList.remove('border-[#cfc5b4]');
    } else {
      errorEl.textContent = '';
      errorEl.classList.add('hidden');
      input.classList.remove('border-[#ba1a1a]');
      input.classList.add('border-[#cfc5b4]');
    }
  }

  function clearLoginErrors() {
    loginErrorMsg.classList.add('hidden');
    loginIdInput.classList.remove('border-[#ba1a1a]');
    loginIdInput.classList.add('border-[#cfc5b4]');
    loginPasswordInput.classList.remove('border-[#ba1a1a]');
    loginPasswordInput.classList.add('border-[#cfc5b4]');
  }

  function clearSignupErrors() {
    setFieldError(signupLoginIdInput, signupLoginIdError, null);
    setFieldError(signupEmailInput, signupEmailError, null);
    setFieldError(signupPasswordInput, signupPasswordError, null);
    setFieldError(signupConfirmPasswordInput, signupConfirmPasswordError, null);
  }

  // Tab & Alt Button Navigation
  tabLogin.addEventListener('click', () => setMode('login'));
  tabSignup.addEventListener('click', () => setMode('signup'));
  altBtn.addEventListener('click', () => setMode(currentMode === 'login' ? 'signup' : 'login'));
  linkGotoSignup.addEventListener('click', () => setMode('signup'));
  linkGotoLogin.addEventListener('click', () => setMode('login'));

  // Quick Auto-Fill Demo Credentials
  const btnFillDemo = document.getElementById('btn-fill-demo');
  if (btnFillDemo) {
    btnFillDemo.addEventListener('click', () => {
      loginIdInput.value = "demo_admin";
      loginPasswordInput.value = "StockSense2026!";
      clearLoginErrors();
      showToast("Demo credentials loaded.", "info");
    });
  }

  // Password Show / Hide Toggles
  toggleLoginPwdBtn.addEventListener('click', () => {
    if (loginPasswordInput.type === 'password') {
      loginPasswordInput.type = 'text';
      loginPwdIcon.textContent = 'visibility_off';
      loginPwdText.textContent = 'HIDE';
    } else {
      loginPasswordInput.type = 'password';
      loginPwdIcon.textContent = 'visibility';
      loginPwdText.textContent = 'SHOW';
    }
  });

  toggleSignupPwdBtn.addEventListener('click', () => {
    if (signupPasswordInput.type === 'password') {
      signupPasswordInput.type = 'text';
      signupPwdIcon.textContent = 'visibility_off';
      signupPwdText.textContent = 'HIDE';
    } else {
      signupPasswordInput.type = 'password';
      signupPwdIcon.textContent = 'visibility';
      signupPwdText.textContent = 'SHOW';
    }
  });

  // --- Sign Up Live / Blur Validations ---
  signupLoginIdInput.addEventListener('blur', () => {
    const val = signupLoginIdInput.value.trim();
    if (val) {
      const err = store.validateLoginId(val);
      setFieldError(signupLoginIdInput, signupLoginIdError, err);
    }
  });
  signupLoginIdInput.addEventListener('input', () => {
    if (!signupLoginIdError.classList.contains('hidden')) {
      const err = store.validateLoginId(signupLoginIdInput.value.trim());
      setFieldError(signupLoginIdInput, signupLoginIdError, err);
    }
  });

  signupEmailInput.addEventListener('blur', () => {
    const val = signupEmailInput.value.trim();
    if (val) {
      const err = store.validateEmail(val);
      setFieldError(signupEmailInput, signupEmailError, err);
    }
  });
  signupEmailInput.addEventListener('input', () => {
    if (!signupEmailError.classList.contains('hidden')) {
      const err = store.validateEmail(signupEmailInput.value.trim());
      setFieldError(signupEmailInput, signupEmailError, err);
    }
  });

  signupPasswordInput.addEventListener('input', () => {
    const val = signupPasswordInput.value;
    if (val) {
      const err = store.validatePassword(val);
      setFieldError(signupPasswordInput, signupPasswordError, err);
    } else {
      setFieldError(signupPasswordInput, signupPasswordError, null);
    }
    // Also revalidate confirm password if it has value
    if (signupConfirmPasswordInput.value) {
      const confirmErr = store.validateConfirmPassword(val, signupConfirmPasswordInput.value);
      setFieldError(signupConfirmPasswordInput, signupConfirmPasswordError, confirmErr);
    }
  });

  signupConfirmPasswordInput.addEventListener('blur', () => {
    const err = store.validateConfirmPassword(signupPasswordInput.value, signupConfirmPasswordInput.value);
    setFieldError(signupConfirmPasswordInput, signupConfirmPasswordError, err);
  });
  signupConfirmPasswordInput.addEventListener('input', () => {
    if (!signupConfirmPasswordError.classList.contains('hidden')) {
      const err = store.validateConfirmPassword(signupPasswordInput.value, signupConfirmPasswordInput.value);
      setFieldError(signupConfirmPasswordInput, signupConfirmPasswordError, err);
    }
  });

  // --- Sign Up Submit Handler ---
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const loginId = signupLoginIdInput.value.trim();
    const email = signupEmailInput.value.trim();
    const password = signupPasswordInput.value;
    const confirmPassword = signupConfirmPasswordInput.value;

    const loginIdErr = store.validateLoginId(loginId);
    const emailErr = store.validateEmail(email);
    const passwordErr = store.validatePassword(password);
    const confirmErr = store.validateConfirmPassword(password, confirmPassword);

    setFieldError(signupLoginIdInput, signupLoginIdError, loginIdErr);
    setFieldError(signupEmailInput, signupEmailError, emailErr);
    setFieldError(signupPasswordInput, signupPasswordError, passwordErr);
    setFieldError(signupConfirmPasswordInput, signupConfirmPasswordError, confirmErr);

    if (loginIdErr || emailErr || passwordErr || confirmErr) {
      return;
    }

    const res = store.signupUser({ loginId, email, password, confirmPassword });
    if (!res.success) {
      if (res.errors?.loginId) setFieldError(signupLoginIdInput, signupLoginIdError, res.errors.loginId);
      if (res.errors?.email) setFieldError(signupEmailInput, signupEmailError, res.errors.email);
      if (res.errors?.password) setFieldError(signupPasswordInput, signupPasswordError, res.errors.password);
      if (res.errors?.confirmPassword) setFieldError(signupConfirmPasswordInput, signupConfirmPasswordError, res.errors.confirmPassword);
      return;
    }

    // Success: Redirect to login tab (do not auto-login)
    showToast("Account created successfully! Please sign in with your Login ID.", "success");
    signupForm.reset();
    clearSignupErrors();
    setMode('login');
    loginIdInput.value = loginId;
    loginPasswordInput.focus();
  });

  // --- Login Submit Handler ---
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearLoginErrors();

    const loginId = loginIdInput.value.trim();
    const password = loginPasswordInput.value;

    const res = store.loginUser(loginId, password);
    if (!res.success) {
      // Show exact spec error message: "Invalid Login Id or Password."
      loginErrorMsg.textContent = res.error || "Invalid Login Id or Password.";
      loginErrorMsg.classList.remove('hidden');
      loginIdInput.classList.add('border-[#ba1a1a]');
      loginPasswordInput.classList.add('border-[#ba1a1a]');
      return;
    }

    const submitBtn = document.getElementById('btn-login-submit');
    submitBtn.disabled = true;
    submitBtn.classList.remove('bg-[#b84328]');
    submitBtn.classList.add('bg-[#536443]');
    submitBtn.querySelector('span:last-child').textContent = "Signing In...";

    setTimeout(() => {
      window.location.hash = '#dashboard';
    }, 300);
  });

  loginIdInput.addEventListener('input', clearLoginErrors);
  loginPasswordInput.addEventListener('input', clearLoginErrors);

  // --- OTP Flow (P0.2) ---
  const step1 = document.getElementById('reset-step-1');
  const step2 = document.getElementById('reset-step-2');
  const step3 = document.getElementById('reset-step-3');
  const stepIndicator = document.getElementById('otp-step-indicator');
  const stepDesc = document.getElementById('otp-step-desc');
  const otpBanner = document.getElementById('otp-display-banner');
  const mockOtpCode = document.getElementById('mock-otp-code');
  const btnCancelReset = document.getElementById('btn-cancel-reset');

  let resetEmailVal = "";

  btnForgotPwd.addEventListener('click', () => {
    authMainPanel.classList.add('hidden');
    tabsContainer.classList.add('hidden');
    resetPanel.classList.remove('hidden');

    step1.classList.remove('hidden');
    step2.classList.add('hidden');
    step3.classList.add('hidden');
    otpBanner.classList.add('hidden');
    stepIndicator.textContent = "STEP 1 OF 3";
    stepDesc.textContent = "Enter your registered email address to receive a 6-digit OTP verification code.";
  });

  btnCancelReset.addEventListener('click', () => {
    setMode('login');
  });

  // Step 1 -> Step 2
  document.getElementById('btn-request-otp').addEventListener('click', () => {
    const email = document.getElementById('reset-email').value.trim();
    const res = store.requestPasswordReset(email);
    if (!res.success) {
      showToast(res.error, 'error');
      return;
    }

    resetEmailVal = res.email;
    mockOtpCode.textContent = res.otp;
    otpBanner.classList.remove('hidden');

    step1.classList.add('hidden');
    step2.classList.remove('hidden');
    stepIndicator.textContent = "STEP 2 OF 3";
    stepDesc.textContent = `A 6-digit verification code has been generated for ${resetEmailVal}. Enter it below:`;

    // Pre-fill for convenience
    document.getElementById('reset-otp-input').value = res.otp;
    showToast(`6-Digit OTP generated: ${res.otp}`, 'success');
  });

  // Step 2 -> Step 3
  document.getElementById('btn-verify-otp').addEventListener('click', () => {
    const code = document.getElementById('reset-otp-input').value.trim();
    if (code.length !== 6) {
      showToast("Please enter a valid 6-digit code.", "error");
      return;
    }

    step2.classList.add('hidden');
    step3.classList.remove('hidden');
    stepIndicator.textContent = "STEP 3 OF 3";
    stepDesc.textContent = "Identity verified! Set your new password.";
  });

  // Step 3 -> Finish
  document.getElementById('btn-save-new-pwd').addEventListener('click', () => {
    const code = document.getElementById('reset-otp-input').value.trim();
    const newPwd = document.getElementById('reset-new-pwd').value;
    const pwdErr = store.validatePassword(newPwd);
    if (pwdErr) {
      showToast(pwdErr, 'error');
      return;
    }

    const res = store.verifyResetOtp(resetEmailVal, code, newPwd);
    if (!res.success) {
      showToast(res.error, 'error');
      return;
    }

    showToast("Password updated successfully! Please sign in with your new password.", "success");
    setMode('login');
    const user = (store.state.users || []).find(u => (u.email || '').toLowerCase() === resetEmailVal.toLowerCase());
    if (user) {
      loginIdInput.value = user.loginId;
    }
  });

  setMode(initialTab);
}
