(function () {
    var MIN_ALLOWED             = 200000;
    var HIGH_VALUE              = 1500000;
    var TASA_EA                 = 28.79 / 100;
    var TASA_MENSUAL            = Math.pow(1 + TASA_EA, 1 / 12) - 1;
    var FIANZA_INITIAL_RATE     = 5 / 100;
    var FIANZA_REGULAR_RATE     = 0.032;
    var IVA_RATE                = 0.19;
    var INSURANCE_RATE          = 0.003;
    var ADMIN_FEE               = 32900;
    var amountInput             = document.getElementById('monto__input');
    var monthsInput             = document.getElementById('plazo__input');
    var monthsValueDisplay      = document.getElementById('plazo__value');
    var monthsAlert             = document.getElementById('months-alert');
    var minAlert                = document.getElementById('min-alert');
    var amountDisplay           = document.getElementById('monto-valor');
    var amountCard              = document.querySelector('.monto');
    var installmentDisplay      = document.getElementById('vlr__cuota');
    var initialBondDisplay      = document.getElementById('fianza__anticipada');
    var regularBondDisplay      = document.getElementById('fianza__regular');
    var interestDisplay         = document.getElementById('intereses');
    var insuranceDisplay        = document.getElementById('seguro');
    var adminFeeDisplay         = document.getElementById('cuota__administracion');
    var disbursedDisplay        = document.getElementById('valor__desembolsar');
    var summarySection          = document.getElementById('summary-section');
    var summaryStartDisplay     = document.getElementById('summary__cuota_inicio');
    var summaryRecurringLabel   = document.getElementById('summary__cuota_label');
    var summaryRecurringDisplay = document.getElementById('summary__cuota_restante');
    var summaryAdminFeeDisplay  = document.getElementById('summary__admin_fee');
    var summaryInsuranceDisplay = document.getElementById('summary__insurance');
    var initialRateDisplay      = document.getElementById('rate__fianza_inicial');
    var ivaRateDisplay          = document.getElementById('rate__iva');
    var regularRateDisplay      = document.getElementById('rate__fianza_regular');
    var regularIvaRateDisplay   = document.getElementById('rate__iva_regular');
    var monthlyRateDisplay      = document.getElementById('rate__monthly_interest');
    var insuranceRateDisplay    = document.getElementById('rate__insurance');
    var termsToggleButton       = document.getElementById('terms-toggle-btn');
    var termsSection            = document.getElementById('terms-section');
    var infoDataButton          = document.getElementById('info-data-btn');
    var infoDataPanel           = document.getElementById('info-data-panel');

    if (!amountInput || !monthsInput || !minAlert || !amountDisplay || !amountCard || !installmentDisplay || !initialBondDisplay || !regularBondDisplay || !interestDisplay || !insuranceDisplay || !adm[...]
        return;
    }

    function parseCurrency(rawValue) {
        var onlyDigits = rawValue.replace(/\D/g, '');
        return onlyDigits ? Number(onlyDigits) : 0;
    }

    function formatThousands(rawValue) {
        var onlyDigits = rawValue.replace(/\D/g, '');

        if (!onlyDigits) {
            return '';
        }

        return Number(onlyDigits).toLocaleString('es-CO', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    }

    function formatCurrency(value) {
        var numericValue = Number(value);
        var safeValue = isFinite(numericValue) ? numericValue : 0;

        return '$' + Math.round(safeValue).toLocaleString('es-CO', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    }

    function formatPercentFromRate(rate) {
        return (rate * 100).toLocaleString('es-CO', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }) + '%';
    }

    function parseMonths(rawValue) {
        var onlyDigits = rawValue.replace(/\D/g, '');
        var months = onlyDigits ? Number(onlyDigits) : 1;

        if (months < 1) {
            return 1;
        }

        if (months > 12) {
            return 12;
        }

        return months;
    }

    function updateMontoState(amount) {
        amountCard.classList.remove('monto--low', 'monto--normal', 'monto--high');

        if (amount > 0 && amount < MIN_ALLOWED) {
            amountCard.classList.add('monto--low');
            return;
        }

        if (amount >= HIGH_VALUE) {
            amountCard.classList.add('monto--high');
            return;
        }

        amountCard.classList.add('monto--normal');
    }

    function updateAmountDisplay() {
        var valor = parseCurrency(amountInput.value);
        var hasAmount = amountInput.value.trim() !== '';
        var safeAmount = hasAmount && valor > 0 ? valor : 0;

        amountDisplay.textContent = formatCurrency(safeAmount);
        updateMontoState(valor);
    }

    function updateInstallment() {
        var valor = parseCurrency(amountInput.value);
        var hasAmount = amountInput.value.trim() !== '';

        if (!hasAmount) {
            installmentDisplay.textContent = formatCurrency(0);
            return;
        }

        var amountForCalculation = valor > 0 ? Math.max(valor, MIN_ALLOWED) : MIN_ALLOWED;
        var months = parseMonths(monthsInput.value);

        var baseInstallment =
            (amountForCalculation * TASA_MENSUAL) /
            (1 - Math.pow(1 + TASA_MENSUAL, -months));

        var seguro = valor * INSURANCE_RATE;
        var fianzaSinIva = amountForCalculation * FIANZA_INITIAL_RATE;
        var fianzaAnticipada = fianzaSinIva + (fianzaSinIva * IVA_RATE);
        var totalInstallment = baseInstallment + seguro + fianzaAnticipada + ADMIN_FEE;

        installmentDisplay.textContent = formatCurrency(totalInstallment);
    }

    function updateInitialBond() {
        var valor = parseCurrency(amountInput.value);
        var hasAmount = amountInput.value.trim() !== '';

        if (!hasAmount) {
            initialBondDisplay.textContent = formatCurrency(0);
            return;
        }

        var monto = valor > 0 ? Math.max(valor, MIN_ALLOWED) : MIN_ALLOWED;
        var fianzaSinIva = monto * FIANZA_INITIAL_RATE;
        var ivaFianza = fianzaSinIva * IVA_RATE;
        var fianzaAnticipada = ivaFianza + fianzaSinIva;

        initialBondDisplay.textContent = formatCurrency(fianzaAnticipada);
    }

    function updateRegularBond() {
        var valor = parseCurrency(amountInput.value);
        var hasAmount = amountInput.value.trim() !== '';

        if (!hasAmount) {
            regularBondDisplay.textContent = formatCurrency(0);
            return;
        }

        var monto = valor > 0 ? Math.max(valor, MIN_ALLOWED) : MIN_ALLOWED;
        var fianzaRegularBase = monto * FIANZA_REGULAR_RATE;
        var fianzaRegular = fianzaRegularBase + (fianzaRegularBase * IVA_RATE);

        regularBondDisplay.textContent = formatCurrency(fianzaRegular);
    }

    function updateInterest() {
        var valor = parseCurrency(amountInput.value);
        var hasAmount = amountInput.value.trim() !== '';

        if (!hasAmount) {
            interestDisplay.textContent = formatCurrency(0);
            return;
        }

        var interes = valor * TASA_MENSUAL;
        interestDisplay.textContent = formatCurrency(interes);
    }

    function updateInsurance() {
        var valor = parseCurrency(amountInput.value);
        var hasAmount = amountInput.value.trim() !== '';

        if (!hasAmount) {
            insuranceDisplay.textContent = formatCurrency(0);
            return;
        }

        var seguro = valor * INSURANCE_RATE;
        insuranceDisplay.textContent = formatCurrency(seguro);
    }

    function updateAdminFee() {
        var hasAmount = amountInput.value.trim() !== '';
        adminFeeDisplay.textContent = hasAmount ? formatCurrency(ADMIN_FEE) : formatCurrency(0);
    }

    function updateDisbursedAmount() {
        var valor = parseCurrency(amountInput.value);
        var hasAmount = amountInput.value.trim() !== '';

        if (!hasAmount) {
            disbursedDisplay.textContent = formatCurrency(0);
            return;
        }

        var monto = valor > 0 ? Math.max(valor, MIN_ALLOWED) : MIN_ALLOWED;
        var fianzaSinIva = monto * FIANZA_INITIAL_RATE;
        var fianzaAnticipada = fianzaSinIva + (fianzaSinIva * IVA_RATE);
        var desembolsar = monto;

        disbursedDisplay.textContent = formatCurrency(desembolsar);
    }

    function updateSummary() {
        var valor = parseCurrency(amountInput.value);
        var hasAmount = amountInput.value.trim() !== '';
        var months = parseMonths(monthsInput.value);
        var showRecurringSummary = months > 1;
        var summaryRecurringRow = summaryRecurringLabel.parentElement;

        summaryRecurringLabel.hidden = !showRecurringSummary;
        summaryRecurringDisplay.hidden = !showRecurringSummary;

        if (summaryRecurringRow) {
            summaryRecurringRow.hidden = !showRecurringSummary;
            summaryRecurringRow.style.display = showRecurringSummary ? '' : 'none';
        }

        summaryRecurringLabel.textContent = 'Cuota 2 a ' + months + ':';

        if (!hasAmount) {
            summaryStartDisplay.textContent = formatCurrency(0);
            summaryRecurringDisplay.textContent = formatCurrency(0);
            if (summaryAdminFeeDisplay) {
                summaryAdminFeeDisplay.textContent = formatCurrency(0);
            }
            if (summaryInsuranceDisplay) {
                summaryInsuranceDisplay.textContent = formatCurrency(0);
            }
            return;
        }

        var amountForCalculation = valor > 0 ? Math.max(valor, MIN_ALLOWED) : MIN_ALLOWED;
        var baseInstallment =
            (amountForCalculation * TASA_MENSUAL) /
            (1 - Math.pow(1 + TASA_MENSUAL, -months));

        var seguro = valor * INSURANCE_RATE;
        var fianzaAnticipadaBase = amountForCalculation * FIANZA_INITIAL_RATE;
        var fianzaAnticipada = fianzaAnticipadaBase + (fianzaAnticipadaBase * IVA_RATE);
        var fianzaRegularBase = amountForCalculation * FIANZA_REGULAR_RATE;
        var fianzaRegular = fianzaRegularBase + (fianzaRegularBase * IVA_RATE);

        var cuotaInicio = baseInstallment + seguro + fianzaAnticipada + ADMIN_FEE;
        var cuota2aN    = baseInstallment + seguro + fianzaRegular + ADMIN_FEE;

        summaryStartDisplay.textContent     = formatCurrency(cuotaInicio);
        summaryRecurringDisplay.textContent = formatCurrency(cuota2aN);
        if (summaryAdminFeeDisplay) {
            summaryAdminFeeDisplay.textContent = formatCurrency(ADMIN_FEE);
        }
        if (summaryInsuranceDisplay) {
            summaryInsuranceDisplay.textContent = formatCurrency(seguro);
        }
    }

    function updateFloatingRatesCard() {
        initialRateDisplay.textContent = formatPercentFromRate(FIANZA_INITIAL_RATE);
        ivaRateDisplay.textContent = formatPercentFromRate(IVA_RATE);
        regularRateDisplay.textContent = formatPercentFromRate(FIANZA_REGULAR_RATE);
        regularIvaRateDisplay.textContent = formatPercentFromRate(IVA_RATE);
        monthlyRateDisplay.textContent = formatPercentFromRate(TASA_MENSUAL);
        insuranceRateDisplay.textContent = formatPercentFromRate(INSURANCE_RATE);
    }

    function setupInfoDataToggle() {
        if (!infoDataButton || !infoDataPanel) {
            return;
        }

        infoDataButton.addEventListener('click', function () {
            var isHidden = infoDataPanel.hasAttribute('hidden');

            if (isHidden) {
                infoDataPanel.removeAttribute('hidden');
                infoDataButton.setAttribute('aria-expanded', 'true');
                return;
            }

            infoDataPanel.setAttribute('hidden', 'hidden');
            infoDataButton.setAttribute('aria-expanded', 'false');
        });
    }

    function hasRequiredInputs() {
        return amountInput.value.trim() !== '' && monthsInput.value.trim() !== '';
    }

    function updateTermsToggleState() {
        if (!termsToggleButton || !termsSection) {
            return;
        }

        var canToggleTerms = hasRequiredInputs();

        termsToggleButton.disabled = !canToggleTerms;

        if (!canToggleTerms) {
            termsSection.setAttribute('hidden', 'hidden');
            termsToggleButton.setAttribute('aria-expanded', 'false');
            termsToggleButton.textContent = 'Ver t\u00e9rminos del cr\u00e9dito';
        }
    }

    function updateSummaryVisibility() {
        if (!summarySection) {
            return;
        }

        if (hasRequiredInputs()) {
            summarySection.removeAttribute('hidden');
            return;
        }

        summarySection.setAttribute('hidden', 'hidden');
    }

    function setupTermsToggle() {
        if (!termsToggleButton || !termsSection) {
            return;
        }

        termsToggleButton.addEventListener('click', function () {
            if (termsToggleButton.disabled) {
                return;
            }

            var isHidden = termsSection.hasAttribute('hidden');

            if (isHidden) {
                termsSection.removeAttribute('hidden');
                termsToggleButton.setAttribute('aria-expanded', 'true');
                termsToggleButton.textContent = 'Ocultar t\u00e9rminos del cr\u00e9dito';
                return;
            }

            termsSection.setAttribute('hidden', 'hidden');
            termsToggleButton.setAttribute('aria-expanded', 'false');
            termsToggleButton.textContent = 'Ver t\u00e9rminos del cr\u00e9dito';
        });
    }

    function toggleMinAlert() {
        var hasInput = amountInput.value.trim() !== '';
        var valor = parseCurrency(amountInput.value);
        var shouldShow = hasInput && valor > 0 && valor < MIN_ALLOWED;

        minAlert.classList.toggle('is-visible', shouldShow);
    }

    function toggleMonthsAlert() {
        if (!monthsAlert) {
            return;
        }

        var rawValue = monthsInput.value.trim();
        var onlyDigits = rawValue.replace(/\D/g, '');
        var hasInput = rawValue !== '';
        var numericValue = onlyDigits ? Number(onlyDigits) : 0;
        var isOutOfRange = !onlyDigits || numericValue < 1 || numericValue > 12;
        var shouldShow = hasInput && isOutOfRange;

        monthsAlert.classList.toggle('is-visible', shouldShow);
    }

    function updateMonthsDisplay() {
        if (!monthsValueDisplay) {
            return;
        }

        monthsValueDisplay.textContent = String(parseMonths(monthsInput.value));
    }

    function onAmountChange() {
        amountInput.value = formatThousands(amountInput.value);
        updateAmountDisplay();
        toggleMinAlert();
        updateSummaryVisibility();
        updateTermsToggleState();
        updateInstallment();
        updateInitialBond();
        updateRegularBond();
        updateInterest();
        updateInsurance();
        updateAdminFee();
        updateDisbursedAmount();
        updateSummary();
    }

    function onMonthsChange() {
        toggleMonthsAlert();
        updateMonthsDisplay();
        updateSummaryVisibility();
        updateTermsToggleState();
        updateInstallment();
        updateSummary();
    }

    amountInput.addEventListener('input', onAmountChange);
    amountInput.addEventListener('blur', onAmountChange);
    monthsInput.addEventListener('input', onMonthsChange);
    monthsInput.addEventListener('blur', onMonthsChange);

    onAmountChange();
    onMonthsChange();
    toggleMonthsAlert();
    updateMonthsDisplay();
    updateInitialBond();
    updateRegularBond();
    updateInterest();
    updateInsurance();
    updateAdminFee();
    updateDisbursedAmount();
    updateSummary();
    updateFloatingRatesCard();
    setupInfoDataToggle();
    setupTermsToggle();
    updateSummaryVisibility();
    updateTermsToggleState();
})();
