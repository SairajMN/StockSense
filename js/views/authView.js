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
            SYS.BAY // v2.4
          </div>
        </div>

        <!-- Center: Headline, Tagline & Technical Line Art Vector -->
        <div class="relative z-10 my-10 lg:my-auto flex flex-col gap-6">
          <div class="space-y-2">
            <div class="inline-flex items-center gap-2 font-mono text-[11px] text-[#fdf9f4]/80 tracking-widest uppercase">
              <span class="w-2 h-2 rounded-full bg-[#fdf9f4] inline-block animate-pulse"></span>
              WAREHOUSE INVENTORY &amp; DOCK TELEMETRY LEDGER
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
            <p>• Automated barcode &amp; RF telemetry synchronization</p>
            <p>• Immutable ledger tracking for dock loading &amp; transfer bays</p>
          </div>
        </div>

        <!-- Bottom: Serial & Release Stamp Footer -->
        <div class="relative z-10 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono text-[#fdf9f4]/75 border-t border-[#fdf9f4]/20">
          <span class="tracking-widest uppercase">StockSense System • Release 2.4</span>
          <span class="tracking-widest opacity-80 uppercase">TERMINAL LOG: SEC-08 // ONLINE</span>
        </div>
      </aside>

      <!-- RIGHT FORM PANEL (~55% width) -->
      <section class="flex-1 bg-[#f7f3ee] min-h-screen flex flex-col justify-between overflow-y-auto selection:bg-[#ffdad2] selection:text-[#3d0600]">
        <!-- Header Utility Bar -->
        <div class="w-full max-w-xl mx-auto px-6 pt-6 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-none bg-[#536443]"></span>
            <span class="font-mono text-xs text-[#536443] font-bold">SECURE DISPATCH ACCESS</span>
          </div>
          <div class="flex items-center gap-2 font-mono text-xs text-[#58413c]">
            <span id="auth-alt-text">ALREADY A MEMBER?</span>
            <button id="auth-alt-btn" class="text-[#b84328] hover:underline font-bold uppercase cursor-pointer">LOG IN</button>
          </div>
        </div>

        <!-- Centered Authentication Form Container -->
        <main class="w-full max-w-xl mx-auto px-6 py-8 my-auto flex flex-col items-center justify-center">
          <div class="w-full">
            <!-- Index Card Tabs Container -->
            <div id="tabs-container" class="relative z-10 flex items-end justify-start px-2 gap-1 font-mono text-xs">
              <button id="tab-btn-login" class="px-5 py-2 rounded-t-sm font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer">
                <span class="w-2 h-2 rounded-full inline-block"></span>
                <span>[ LOG IN ]</span>
              </button>
              <button id="tab-btn-signup" class="px-5 py-2 rounded-t-sm font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer">
                <span class="w-2 h-2 rounded-full inline-block"></span>
                <span>[ SIGN UP ]</span>
              </button>
            </div>

            <!-- Physical Paper Manifest Sheet Card -->
            <div class="relative z-20 bg-white shadow-md border border-[#cfc5b4] p-6 sm:p-8 md:p-10 rounded-xs">
              <!-- Perforated Stub Line -->
              <div class="w-full pb-3 mb-4 opacity-50 select-none overflow-hidden">
                <span class="font-mono text-[10px] text-[#8c716b] tracking-widest whitespace-nowrap">
                  - - - - - TEAR SHEET ALONG REGISTRATION RULE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                </span>
              </div>

              <!-- Main Auth Form Container -->
              <div id="auth-main-panel">
                <!-- Manifest Header Block -->
                <div class="flex flex-col pb-4 mb-6 border-b border-[#cfc5b4]/60">
                  <h2 id="auth-form-title" class="font-mono text-2xl font-bold uppercase text-[#262421] tracking-tight">LOG IN</h2>
                  <p id="auth-form-subtitle" class="font-body text-sm text-[#58413c] mt-1">Enter your credentials to access the terminal deck.</p>
                </div>

                <!-- Main Form -->
                <form id="auth-form" class="flex flex-col gap-4">
                  <!-- Operator Name (Sign Up only) -->
                  <div id="group-name" class="flex flex-col gap-1 hidden">
                    <label class="font-mono text-xs uppercase text-[#262421] font-bold tracking-wider flex justify-between" for="auth-name">
                      <span>OPERATOR FULL NAME // BADGE CALLOUT</span>
                      <span class="text-[#b84328]">[REQUIRED]</span>
                    </label>
                    <input id="auth-name" type="text" placeholder="e.g. MARCUS VANCE" 
                      class="w-full bg-[#fdf9f4] border border-[#cfc5b4] rounded-none p-2.5 font-mono text-sm text-[#262421] focus:outline-none focus:border-[#b84328]" />
                  </div>

                  <!-- Email -->
                  <div class="flex flex-col gap-1">
                    <label class="font-mono text-xs uppercase text-[#262421] font-bold tracking-wider flex justify-between" for="auth-email">
                      <span id="label-email">OPERATOR EMAIL // DISPATCH ID</span>
                      <span class="text-[#536443] font-normal">[VERIFIED]</span>
                    </label>
                    <input id="auth-email" type="email" required placeholder="marcus.vance@stocksense.io"
                      class="w-full bg-[#fdf9f4] border border-[#cfc5b4] rounded-none p-2.5 font-mono text-sm text-[#262421] focus:outline-none focus:border-[#b84328]" />
                  </div>

                  <!-- Assigned Sector (Sign Up only) -->
                  <div id="group-zone" class="flex flex-col gap-1 hidden">
                    <label class="font-mono text-xs uppercase text-[#262421] font-bold tracking-wider flex justify-between" for="auth-zone">
                      <span>ASSIGNED SECTOR // DEPOT ZONE</span>
                      <span class="text-[#536443]">[ACTIVE]</span>
                    </label>
                    <select id="auth-zone" class="w-full bg-[#fdf9f4] border border-[#cfc5b4] rounded-none p-2.5 font-mono text-sm text-[#262421] focus:outline-none focus:border-[#b84328]">
                      <option value="WH-01">WH-01 [MAIN AUTOMATED BAY]</option>
                      <option value="WH-02">WH-02 [COLD STORAGE VAULT]</option>
                      <option value="WH-03">WH-03 [PALLET RACKING NORTH]</option>
                      <option value="WH-04">WH-04 [HAZMAT INSPECTION PIT]</option>
                    </select>
                  </div>

                  <!-- Password -->
                  <div class="flex flex-col gap-1">
                    <div class="flex items-center justify-between">
                      <label class="font-mono text-xs uppercase text-[#262421] font-bold tracking-wider" for="auth-password">SECURITY ACCESS KEY</label>
                      <button id="toggle-pwd-btn" type="button" class="font-mono text-xs text-[#b84328] uppercase hover:underline flex items-center gap-1 cursor-pointer">
                        <span class="material-symbols-outlined text-[15px]" id="pwd-icon">visibility</span>
                        <span id="pwd-text">SHOW</span>
                      </button>
                    </div>
                    <input id="auth-password" type="password" required placeholder="••••••••••••"
                      class="w-full bg-[#fdf9f4] border border-[#cfc5b4] rounded-none p-2.5 font-mono text-sm text-[#262421] focus:outline-none focus:border-[#b84328] tracking-widest" />
                  </div>

                  <!-- Options Row with "Forgot Password?" (P0.2) -->
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 font-mono text-xs">
                    <label class="flex items-center gap-2 cursor-pointer select-none">
                      <input id="remember-me" type="checkbox" checked class="accent-[#b84328] w-4 h-4 rounded-none cursor-pointer" />
                      <span class="text-[#58413c] uppercase">REMEMBER TERMINAL</span>
                    </label>

                    <div class="flex items-center gap-3">
                      <button type="button" id="btn-forgot-password" class="text-[#b84328] font-bold hover:underline uppercase cursor-pointer">
                        FORGOT PASSWORD?
                      </button>
                      <span class="text-[#cfc5b4]">•</span>
                      <button type="button" id="demo-operator-btn" class="text-[#536443] font-bold hover:underline uppercase cursor-pointer">
                        ⚡ DEMO
                      </button>
                    </div>
                  </div>

                  <!-- Terms agreement (Sign up only) -->
                  <div id="group-terms" class="pt-1 select-none hidden">
                    <label class="flex items-start gap-2 cursor-pointer">
                      <input id="agree-terms" type="checkbox" class="accent-[#b84328] w-4 h-4 rounded-none mt-0.5 cursor-pointer" />
                      <span class="font-mono text-xs text-[#58413c]">
                        I AGREE TO THE <a href="#" class="text-[#b84328] hover:underline">TERMS OF SERVICE</a> AND <a href="#" class="text-[#b84328] hover:underline">DEPOT SAFETY RULES</a>
                      </span>
                    </label>
                  </div>

                  <!-- Submit Button -->
                  <div class="pt-4 flex flex-col gap-3">
                    <button id="auth-submit-btn" type="submit" 
                      class="w-full py-3 px-6 rounded-none bg-[#b84328] hover:bg-[#972b12] text-white font-mono text-sm font-bold uppercase tracking-wider shadow-sm transform -rotate-[0.5deg] hover:rotate-0 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer">
                      <span class="material-symbols-outlined text-[20px]" id="auth-submit-icon">login</span>
                      <span id="auth-submit-label">LOG IN TO COMMAND DECK</span>
                    </button>
                  </div>
                </form>
              </div>

              <!-- OTP-Based Password Reset 3-Step Panel (P0.2) -->
              <div id="reset-panel" class="hidden">
                <div class="flex flex-col pb-4 mb-5 border-b border-[#cfc5b4]/60">
                  <div class="flex items-center justify-between">
                    <h2 class="font-mono text-xl font-bold uppercase text-[#262421] tracking-tight">SECURITY KEY RECOVERY // OTP</h2>
                    <span id="otp-step-indicator" class="font-mono text-[10px] bg-[#d3e6bd]/40 border border-[#536443]/40 text-[#536443] px-2 py-0.5 font-bold uppercase">
                      STEP 1 OF 3
                    </span>
                  </div>
                  <p id="otp-step-desc" class="font-body text-xs text-[#58413c] mt-1">
                    Enter your registered operator dispatch email to receive a 6-digit OTP verification code.
                  </p>
                </div>

                <!-- OTP Simulated Toast / Display Banner -->
                <div id="otp-display-banner" class="hidden p-3 bg-[#faf7f0] border-2 border-[#536443] mb-4 font-mono text-xs">
                  <div class="flex items-center justify-between">
                    <span class="text-[#536443] font-bold uppercase flex items-center gap-1">
                      <span class="material-symbols-outlined text-[16px]">key</span>
                      <span>SECURE OTP GENERATED:</span>
                    </span>
                    <strong id="mock-otp-code" class="text-base text-[#b84328] tracking-widest font-mono">000000</strong>
                  </div>
                  <div class="text-[10px] text-[#58413c] mt-1">Mock OTP delivered for hackathon demo. Valid for 10 minutes.</div>
                </div>

                <!-- Step 1: Request Email -->
                <div id="reset-step-1" class="space-y-4 font-mono text-xs">
                  <div>
                    <label class="block text-[#565145] font-bold mb-1 uppercase">OPERATOR EMAIL:</label>
                    <input type="email" id="reset-email" placeholder="marcus.vance@stocksense.io" value="marcus.vance@stocksense.io"
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
                    <label class="block text-[#565145] font-bold mb-1 uppercase">NEW SECURITY ACCESS KEY:</label>
                    <input type="password" id="reset-new-pwd" placeholder="••••••••••••"
                      class="w-full bg-[#fdf9f4] border border-[#cfc5b4] p-2.5 text-[#262421] font-bold tracking-widest focus:border-[#b84328] focus:outline-none" />
                  </div>
                  <button id="btn-save-new-pwd" class="w-full py-2.5 bg-[#b84328] hover:bg-[#972b12] text-white font-bold uppercase tracking-wider cursor-pointer">
                    UPDATE ACCESS KEY &amp; LOG IN
                  </button>
                </div>

                <div class="mt-4 pt-3 border-t border-dashed border-[#cfc5b4] flex items-center justify-between text-xs font-mono">
                  <button id="btn-cancel-reset" class="text-[#565145] hover:text-[#b84328] font-bold uppercase cursor-pointer">
                    ← RETURN TO LOG IN
                  </button>
                </div>
              </div>

              <!-- Footer note -->
              <div class="mt-6 pt-4 border-t border-dashed border-[#cfc5b4] flex items-center justify-between text-[11px] font-mono text-[#58413c]">
                <span>ENCRYPTION: AES-256-GCM</span>
                <span class="text-[#536443] font-bold">STATUS: DOCK READY</span>
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
            <span class="hover:underline cursor-pointer">MANIFEST SPECS</span>
          </div>
        </footer>
      </section>
    </div>
  `;

  // Attach event handlers
  const tabLogin = document.getElementById('tab-btn-login');
  const tabSignup = document.getElementById('tab-btn-signup');
  const groupName = document.getElementById('group-name');
  const groupZone = document.getElementById('group-zone');
  const groupTerms = document.getElementById('group-terms');
  const formTitle = document.getElementById('auth-form-title');
  const formSubtitle = document.getElementById('auth-form-subtitle');
  const submitLabel = document.getElementById('auth-submit-label');
  const submitIcon = document.getElementById('auth-submit-icon');
  const altText = document.getElementById('auth-alt-text');
  const altBtn = document.getElementById('auth-alt-btn');
  const togglePwdBtn = document.getElementById('toggle-pwd-btn');
  const pwdInput = document.getElementById('auth-password');
  const pwdIcon = document.getElementById('pwd-icon');
  const pwdText = document.getElementById('pwd-text');
  const authForm = document.getElementById('auth-form');
  const demoBtn = document.getElementById('demo-operator-btn');

  const authMainPanel = document.getElementById('auth-main-panel');
  const resetPanel = document.getElementById('reset-panel');
  const tabsContainer = document.getElementById('tabs-container');
  const btnForgotPwd = document.getElementById('btn-forgot-password');
  const btnCancelReset = document.getElementById('btn-cancel-reset');

  let currentMode = initialTab;

  function setMode(mode) {
    currentMode = mode;
    authMainPanel.classList.remove('hidden');
    resetPanel.classList.add('hidden');
    tabsContainer.classList.remove('hidden');

    if (mode === 'signup') {
      tabSignup.className = "px-5 py-2 rounded-t-sm font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer bg-white text-[#b84328] shadow-sm border-t border-l border-r border-[#cfc5b4]";
      tabSignup.querySelector('span:first-child').className = "w-2 h-2 rounded-full inline-block bg-[#b84328]";

      tabLogin.className = "px-5 py-2 rounded-t-sm font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer bg-[#e6e2dd] text-[#58413c] hover:bg-[#ddd9d5]";
      tabLogin.querySelector('span:first-child').className = "w-2 h-2 rounded-full inline-block bg-[#cfc5b4]";

      groupName.classList.remove('hidden');
      groupZone.classList.remove('hidden');
      groupTerms.classList.remove('hidden');
      formTitle.textContent = "CREATE OPERATOR ACCOUNT";
      formSubtitle.textContent = "Register terminal credentials for depot dispatch and telemetry logging.";
      submitLabel.textContent = "REGISTER OPERATOR & ENTER";
      submitIcon.textContent = "person_add";
      altText.textContent = "ALREADY REGISTERED?";
      altBtn.textContent = "LOG IN";
    } else {
      tabLogin.className = "px-5 py-2 rounded-t-sm font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer bg-white text-[#b84328] shadow-sm border-t border-l border-r border-[#cfc5b4]";
      tabLogin.querySelector('span:first-child').className = "w-2 h-2 rounded-full inline-block bg-[#b84328]";

      tabSignup.className = "px-5 py-2 rounded-t-sm font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer bg-[#e6e2dd] text-[#58413c] hover:bg-[#ddd9d5]";
      tabSignup.querySelector('span:first-child').className = "w-2 h-2 rounded-full inline-block bg-[#cfc5b4]";

      groupName.classList.add('hidden');
      groupZone.classList.add('hidden');
      groupTerms.classList.add('hidden');
      formTitle.textContent = "LOG IN TO TERMINAL";
      formSubtitle.textContent = "Enter your credentials to access the terminal deck.";
      submitLabel.textContent = "LOG IN TO COMMAND DECK";
      submitIcon.textContent = "login";
      altText.textContent = "NEED AN ACCOUNT?";
      altBtn.textContent = "SIGN UP";
    }
  }

  tabLogin.addEventListener('click', () => setMode('login'));
  tabSignup.addEventListener('click', () => setMode('signup'));
  altBtn.addEventListener('click', () => setMode(currentMode === 'login' ? 'signup' : 'login'));

  // Toggle Password
  togglePwdBtn.addEventListener('click', () => {
    if (pwdInput.type === 'password') {
      pwdInput.type = 'text';
      pwdIcon.textContent = 'visibility_off';
      pwdText.textContent = 'HIDE';
    } else {
      pwdInput.type = 'password';
      pwdIcon.textContent = 'visibility';
      pwdText.textContent = 'SHOW';
    }
  });

  // Demo Login Quick Action
  demoBtn.addEventListener('click', () => {
    document.getElementById('auth-email').value = "marcus.vance@stocksense.io";
    pwdInput.value = "demo2026";
    store.login("marcus.vance@stocksense.io", "demo2026");
    window.location.hash = '#dashboard';
  });

  // Form Submission
  authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('auth-email').value;
    const password = pwdInput.value;

    const submitBtn = document.getElementById('auth-submit-btn');
    submitBtn.disabled = true;
    submitLabel.textContent = "AUTHENTICATING TELEMETRY...";

    setTimeout(() => {
      if (currentMode === 'signup') {
        const name = document.getElementById('auth-name').value;
        const zone = document.getElementById('auth-zone').value;
        store.signup(name, email, password, zone);
      } else {
        store.login(email, password);
      }
      submitLabel.textContent = "ACCESS GRANTED";
      submitBtn.classList.remove('bg-[#b84328]');
      submitBtn.classList.add('bg-[#536443]');

      setTimeout(() => {
        window.location.hash = '#dashboard';
      }, 400);
    }, 500);
  });

  // --- OTP Flow (P0.2) ---
  const step1 = document.getElementById('reset-step-1');
  const step2 = document.getElementById('reset-step-2');
  const step3 = document.getElementById('reset-step-3');
  const stepIndicator = document.getElementById('otp-step-indicator');
  const stepDesc = document.getElementById('otp-step-desc');
  const otpBanner = document.getElementById('otp-display-banner');
  const mockOtpCode = document.getElementById('mock-otp-code');

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
    stepDesc.textContent = "Enter your registered operator dispatch email to receive a 6-digit OTP verification code.";
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
    stepDesc.textContent = "Identity verified! Set your new security access key for future terminal sessions.";
  });

  // Step 3 -> Finish
  document.getElementById('btn-save-new-pwd').addEventListener('click', () => {
    const code = document.getElementById('reset-otp-input').value.trim();
    const newPwd = document.getElementById('reset-new-pwd').value;
    const res = store.verifyResetOtp(resetEmailVal, code, newPwd);

    if (!res.success) {
      showToast(res.error, 'error');
      return;
    }

    showToast("Password updated successfully! Logging you in...", "success");
    store.login(resetEmailVal, newPwd);
    setTimeout(() => {
      window.location.hash = '#dashboard';
    }, 600);
  });

  setMode(initialTab);
}
