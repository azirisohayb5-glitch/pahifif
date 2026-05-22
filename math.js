// Math Island Challenge Generator
class MathEngine {
  constructor() {
    this.regions = {
      arithmetic: 'غابة الأرقام',
      patterns: 'وادي الأنماط',
      geometry: 'جبل الأشكال',
      logic: 'شاطئ الألغاز'
    };
  }

  // Generate question based on region and difficulty level
  generateQuestion(regionId, level) {
    switch (regionId) {
      case 'arithmetic':
        return this.generateArithmetic(level);
      case 'patterns':
        return this.generatePatterns(level);
      case 'geometry':
        return this.generateGeometry(level);
      case 'logic':
        return this.generateLogic(level);
      default:
        return this.generateArithmetic(1);
    }
  }

  // 1. Arithmetic (غابة الأرقام)
  generateArithmetic(level) {
    let num1, num2, operator, answer;
    let questionText = '';
    let hint = '';

    if (level === 1) {
      // Basic Addition & Subtraction (1 to 10)
      operator = Math.random() > 0.5 ? '+' : '-';
      if (operator === '+') {
        num1 = Math.floor(Math.random() * 8) + 1; // 1-8
        num2 = Math.floor(Math.random() * (10 - num1)) + 1; // ensures sum <= 10
        answer = num1 + num2;
      } else {
        num1 = Math.floor(Math.random() * 9) + 2; // 2-10
        num2 = Math.floor(Math.random() * (num1 - 1)) + 1; // ensures positive diff
        answer = num1 - num2;
      }
      questionText = `احسب الناتج: <span class="math-expr">${num1} ${operator} ${num2} = ؟</span>`;
      hint = `استعن بأصابعك أو ارسم ${num1} دوائر ثم ${operator === '+' ? 'أضف' : 'احذف'} منها ${num2} ديرة لتجد الحل!`;
    } else if (level === 2) {
      // Addition/Subtraction (up to 20) or missing numbers
      const isMissingVal = Math.random() > 0.5;
      operator = Math.random() > 0.5 ? '+' : '-';
      if (operator === '+') {
        num1 = Math.floor(Math.random() * 12) + 3; // 3-14
        num2 = Math.floor(Math.random() * 6) + 3;  // 3-8
        answer = num1 + num2;
        if (isMissingVal) {
          questionText = `أوجد الرقم المفقود لإنهاء المعادلة: <br> <span class="math-expr">${num1} + <span class="math-blank">؟</span> = ${answer}</span>`;
          answer = num2; // the blank is num2
          hint = `اسأل نفسك: ما هو الرقم الذي إذا أضفناه إلى ${num1} يصبح المجموع ${answer}؟ يمكنك طرح ${num1} من ${answer}.`;
        } else {
          questionText = `احسب الناتج: <span class="math-expr">${num1} + ${num2} = ؟</span>`;
          hint = `ابدأ من الرقم الأكبر ${num1} واعدّ تصاعدياً ${num2} خطوات.`;
        }
      } else {
        num1 = Math.floor(Math.random() * 10) + 10; // 10-19
        num2 = Math.floor(Math.random() * 9) + 1;  // 1-9
        answer = num1 - num2;
        if (isMissingVal) {
          questionText = `أوجد الرقم المفقود لإنهاء المعادلة: <br> <span class="math-expr">${num1} - <span class="math-blank">؟</span> = ${answer}</span>`;
          answer = num2;
          hint = `اسأل نفسك: كم نطرح من ${num1} لكي يتبقى لدينا ${answer}؟`;
        } else {
          questionText = `احسب الناتج: <span class="math-expr">${num1} - ${num2} = ؟</span>`;
          hint = `ابدأ من الرقم الأكبر ${num1} واعدّ تنازلياً ${num2} خطوات.`;
        }
      }
    } else if (level === 3) {
      // Basic Multiplication (tables 2, 3, 4, 5)
      num1 = Math.floor(Math.random() * 4) + 2; // 2-5
      num2 = Math.floor(Math.random() * 9) + 1; // 1-9
      answer = num1 * num2;
      questionText = `احسب ناتج الضرب: <span class="math-expr">${num1} × ${num2} = ؟</span>`;
      hint = `الضرب هو جمع متكرر! هذا يعني جمع الرقم ${num2} مع نفسه ${num1} مرات.`;
    } else {
      // Mixed Equations: Multiplication + addition, division
      const isDiv = Math.random() > 0.5;
      if (isDiv) {
        num2 = Math.floor(Math.random() * 5) + 2; // divisor 2-6
        answer = Math.floor(Math.random() * 8) + 2; // quotient 2-9
        num1 = num2 * answer; // dividend
        questionText = `احسب ناتج القسمة: <span class="math-expr">${num1} ÷ ${num2} = ؟</span>`;
        hint = `القسمة هي عكس الضرب! اسأل نفسك: ما هو الرقم الذي إذا ضربناه في ${num2} يكون الناتج ${num1}؟`;
      } else {
        num1 = Math.floor(Math.random() * 4) + 2; // 2-5
        num2 = Math.floor(Math.random() * 5) + 2; // 2-6
        let addVal = Math.floor(Math.random() * 10) + 1;
        answer = (num1 * num2) + addVal;
        questionText = `احسب بدقة (تذكر ترتيب العمليات): <span class="math-expr">(${num1} × ${num2}) + ${addVal} = ؟</span>`;
        hint = `قم أولاً بحساب حاصل الضرب (${num1} × ${num2} = ${num1 * num2})، ثم أضف الرقم ${addVal} إلى الناتج.`;
      }
    }

    const options = this.generateChoices(answer);
    return {
      questionHtml: `<div class="arithmetic-q">${questionText}</div>`,
      options,
      correctIndex: options.indexOf(answer),
      hint,
      reward: 10 + level * 5
    };
  }

  // 2. Patterns (وادي الأنماط)
  generatePatterns(level) {
    let options, answer, hint, questionHtml;

    if (level === 1) {
      // Visual Pattern of Emojis
      const patternTypes = [
        { seq: ['🍎', '🍎', '🍌', '🍎', '🍎', '🍌', '🍎'], next: '🍎', name: 'التفاح والموز' },
        { seq: ['⭐', '🌙', '⭐', '🌙', '⭐', '🌙'], next: '⭐', name: 'النجوم والأقمار' },
        { seq: ['🟢', '🟡', '🟢', '🟡', '🟢'], next: '🟡', name: 'الكرات الملونة' },
        { seq: ['🐱', '🐶', '🐱', '🐶', '🐱'], next: '🐶', name: 'الحيوانات اللطيفة' }
      ];
      const p = patternTypes[Math.floor(Math.random() * patternTypes.length)];
      answer = p.next;
      
      const seqStr = p.seq.map(item => `<span class="pattern-item">${item}</span>`).join(' ');
      questionHtml = `
        <div class="pattern-q">
          <p>أكمل النمط البصري التالي باختيار الشكل الصحيح:</p>
          <div class="emoji-sequence">${seqStr} <span class="pattern-blank">؟</span></div>
        </div>
      `;
      // choices are just the unique items from the sequence
      options = [...new Set(p.seq)];
      if (options.length < 3) {
        // add another emoji as distraction
        const extra = ['🦊', '🦄', '🦁', '🟠'].find(e => !options.includes(e));
        options.push(extra);
      }
      // Shuffle options
      options = this.shuffleArray(options);
      hint = `انظر بتمعن في الترتيب: ما هو الشكل الذي يتكرر مباشرة بعد الشكل الأخير؟`;

    } else if (level === 2) {
      // Simple Arithmetic Sequence (Step of 1, 2, 5, or 10)
      const step = [1, 2, 5, 10][Math.floor(Math.random() * 4)];
      const start = Math.floor(Math.random() * 20) + 1;
      const seq = [start, start + step, start + step * 2, start + step * 3, start + step * 4];
      answer = seq[4];
      seq[4] = '؟';

      const seqStr = seq.map(val => `<span class="number-bubble">${val}</span>`).join(' ➔ ');
      questionHtml = `
        <div class="pattern-q">
          <p>أكمل النمط العددي باكتشاف القاعدة:</p>
          <div class="number-sequence">${seqStr}</div>
        </div>
      `;
      options = this.generateChoices(answer);
      hint = `احسب الفرق بين الرقم الأول والثاني: إنه يزيد بمقدار ${step} في كل خطوة!`;

    } else if (level === 3) {
      // Decreasing arithmetic sequence or grid-based visual matrix
      const step = [2, 3, 5][Math.floor(Math.random() * 3)];
      const start = 30 + Math.floor(Math.random() * 20);
      const seq = [start, start - step, start - step * 2, start - step * 3, start - step * 4];
      answer = seq[4];
      seq[4] = '؟';

      const seqStr = seq.map(val => `<span class="number-bubble bubble-down">${val}</span>`).join(' ➔ ');
      questionHtml = `
        <div class="pattern-q">
          <p>أكمل النمط العددي التنازلي:</p>
          <div class="number-sequence">${seqStr}</div>
        </div>
      `;
      options = this.generateChoices(answer);
      hint = `انظر كيف تتناقص الأرقام. اطرح ${step} من الرقم الأخير لتجد الحل!`;

    } else {
      // Complex pattern (Fibonacci-like or doubling or alternating)
      const patternType = Math.random() > 0.5 ? 'double' : 'alternating';
      let seq = [];
      if (patternType === 'double') {
        const start = [2, 3, 5][Math.floor(Math.random() * 3)];
        seq = [start, start * 2, start * 4, start * 8, start * 16];
        answer = seq[4];
        seq[4] = '؟';
        hint = `كل عدد هو ضعف العدد الذي يسبقه (مضروب في 2). ما هو ضعف العدد ${seq[3]}؟`;
      } else {
        // alternate adding 2 and 5
        let curr = Math.floor(Math.random() * 10) + 1;
        seq.push(curr);
        for(let i=0; i<4; i++) {
          curr += (i % 2 === 0) ? 5 : 2;
          seq.push(curr);
        }
        answer = seq[4];
        seq[4] = '؟';
        hint = `النمط يتناوب: مرة نضيف 5 ومرة نضيف 2. آخر خطوة أضفنا 5، الآن حان دور إضافة 2!`;
      }

      const seqStr = seq.map(val => `<span class="number-bubble bubble-complex">${val}</span>`).join(' ➔ ');
      questionHtml = `
        <div class="pattern-q">
          <p>نمط التحدي المتقدم! أوجد الرقم المفقود:</p>
          <div class="number-sequence">${seqStr}</div>
        </div>
      `;
      options = this.generateChoices(answer);
    }

    return {
      questionHtml,
      options,
      correctIndex: options.indexOf(answer),
      hint,
      reward: 12 + level * 5
    };
  }

  // 3. Geometry (جبل الأشكال)
  generateGeometry(level) {
    let options, answer, hint, questionHtml;

    if (level === 1) {
      // Simple Shape recognition & edges count
      const shapes = [
        { name: 'مثلث', edges: 3, svg: '<polygon points="50,15 90,85 10,85" stroke="#ff4a7d" stroke-width="4" fill="rgba(255, 74, 125, 0.2)"/>' },
        { name: 'مربع', edges: 4, svg: '<rect x="15" y="15" width="70" height="70" stroke="#00d2fc" stroke-width="4" fill="rgba(0, 210, 252, 0.2)" rx="5"/>' },
        { name: 'خماسي الأضلاع', edges: 5, svg: '<polygon points="50,10 90,40 75,85 25,85 10,40" stroke="#ffc837" stroke-width="4" fill="rgba(255, 200, 55, 0.2)"/>' },
        { name: 'سداسي الأضلاع', edges: 6, svg: '<polygon points="50,10 85,30 85,70 50,90 15,70 15,30" stroke="#4ade80" stroke-width="4" fill="rgba(74, 222, 128, 0.2)"/>' }
      ];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      answer = shape.edges;
      
      questionHtml = `
        <div class="geometry-q">
          <p>كم عدد أضلاع هذا الشكل المسمى بـ <strong>(${shape.name})</strong>؟</p>
          <div class="geometry-canvas">
            <svg viewBox="0 0 100 100" width="120" height="120">${shape.svg}</svg>
          </div>
        </div>
      `;
      options = [3, 4, 5, 6];
      hint = `قم بعدّ الحواف المستقيمة التي يتكون منها شكل الـ (${shape.name}).`;

    } else if (level === 2) {
      // Fractions Visuals
      const totalParts = [3, 4, 6, 8][Math.floor(Math.random() * 4)];
      const shadedParts = Math.floor(Math.random() * (totalParts - 1)) + 1; // 1 to totalParts-1
      answer = `${shadedParts}/${totalParts}`;

      // Generate visual grid
      let gridItems = '';
      for (let i = 0; i < totalParts; i++) {
        const isShaded = i < shadedParts ? 'shaded' : '';
        gridItems += `<div class="fraction-box ${isShaded}"></div>`;
      }

      questionHtml = `
        <div class="geometry-q">
          <p>ما هو الكسر الذي يمثله الجزء المظلل باللون الذهبي؟</p>
          <div class="fraction-grid grid-${totalParts}">
            ${gridItems}
          </div>
        </div>
      `;

      // Generate choices
      options = [
        answer,
        `${totalParts - shadedParts}/${totalParts}`, // inverse fraction
        `${shadedParts === 1 ? shadedParts + 1 : shadedParts - 1}/${totalParts}`, // slightly off
        `${shadedParts}/${totalParts + 1}`
      ];
      // filter out duplicates and shuffle
      options = [...new Set(options)].slice(0, 4);
      while (options.length < 4) {
        options.push(`${Math.floor(Math.random() * 5) + 1}/10`);
      }
      options = this.shuffleArray(options);

      hint = `عد الكتل المظللة ليكون البسط (الرقم العلوي)، ثم عد إجمالي الكتل كلها ليكون المقام (الرقم السفلي).`;

    } else if (level === 3) {
      // 3D Block Counting
      // We will present a visual grid of blocks using text art or styled CSS cubes
      // Let's make an SVG of 3D cubes stacked
      const configs = [
        { count: 5, svg: `
          <g transform="translate(10,40)">
            <!-- Layer 1 -->
            <path d="M20,10 L40,0 L60,10 L40,20 Z" fill="#ff7f50" stroke="#000"/>
            <path d="M20,10 L20,30 L40,40 L40,20 Z" fill="#cd5c5c" stroke="#000"/>
            <path d="M40,20 L40,40 L60,30 L60,10 Z" fill="#e9967a" stroke="#000"/>
            
            <g transform="translate(40,-10)">
              <path d="M20,10 L40,0 L60,10 L40,20 Z" fill="#ff7f50" stroke="#000"/>
              <path d="M20,10 L20,30 L40,40 L40,20 Z" fill="#cd5c5c" stroke="#000"/>
              <path d="M40,20 L40,40 L60,30 L60,10 Z" fill="#e9967a" stroke="#000"/>
            </g>
            
            <g transform="translate(20,20)">
              <path d="M20,10 L40,0 L60,10 L40,20 Z" fill="#ff7f50" stroke="#000"/>
              <path d="M20,10 L20,30 L40,40 L40,20 Z" fill="#cd5c5c" stroke="#000"/>
              <path d="M40,20 L40,40 L60,30 L60,10 Z" fill="#e9967a" stroke="#000"/>
            </g>
            
            <!-- Stacked Layer 2 -->
            <g transform="translate(20,0)">
              <path d="M20,10 L40,0 L60,10 L40,20 Z" fill="#ffa07a" stroke="#000"/>
              <path d="M20,10 L20,30 L40,40 L40,20 Z" fill="#e9967a" stroke="#000"/>
              <path d="M40,20 L40,40 L60,30 L60,10 Z" fill="#f08080" stroke="#000"/>
            </g>
            
            <g transform="translate(40,-30)">
              <path d="M20,10 L40,0 L60,10 L40,20 Z" fill="#ffa07a" stroke="#000"/>
              <path d="M20,10 L20,30 L40,40 L40,20 Z" fill="#e9967a" stroke="#000"/>
              <path d="M40,20 L40,40 L60,30 L60,10 Z" fill="#f08080" stroke="#000"/>
            </g>
          </g>
        ` },
        { count: 6, svg: `
          <g transform="translate(10,45)">
            <!-- 3 base cubes -->
            <g transform="translate(0,20)">
              <path d="M15,8 L30,0 L45,8 L30,16 Z" fill="#32cd32" stroke="#000"/>
              <path d="M15,8 L15,24 L30,32 L30,16 Z" fill="#228b22" stroke="#000"/>
              <path d="M30,16 L30,32 L45,24 L45,8 Z" fill="#90ee90" stroke="#000"/>
            </g>
            <g transform="translate(30,35)">
              <path d="M15,8 L30,0 L45,8 L30,16 Z" fill="#32cd32" stroke="#000"/>
              <path d="M15,8 L15,24 L30,32 L30,16 Z" fill="#228b22" stroke="#000"/>
              <path d="M30,16 L30,32 L45,24 L45,8 Z" fill="#90ee90" stroke="#000"/>
            </g>
            <g transform="translate(60,20)">
              <path d="M15,8 L30,0 L45,8 L30,16 Z" fill="#32cd32" stroke="#000"/>
              <path d="M15,8 L15,24 L30,32 L30,16 Z" fill="#228b22" stroke="#000"/>
              <path d="M30,16 L30,32 L45,24 L45,8 Z" fill="#90ee90" stroke="#000"/>
            </g>
            <!-- 2 middle cubes -->
            <g transform="translate(15,0)">
              <path d="M15,8 L30,0 L45,8 L30,16 Z" fill="#7cfc00" stroke="#000"/>
              <path d="M15,8 L15,24 L30,32 L30,16 Z" fill="#556b2f" stroke="#000"/>
              <path d="M30,16 L30,32 L45,24 L45,8 Z" fill="#adff2f" stroke="#000"/>
            </g>
            <g transform="translate(45,0)">
              <path d="M15,8 L30,0 L45,8 L30,16 Z" fill="#7cfc00" stroke="#000"/>
              <path d="M15,8 L15,24 L30,32 L30,16 Z" fill="#556b2f" stroke="#000"/>
              <path d="M30,16 L30,32 L45,24 L45,8 Z" fill="#adff2f" stroke="#000"/>
            </g>
            <!-- 1 top cube -->
            <g transform="translate(30,-20)">
              <path d="M15,8 L30,0 L45,8 L30,16 Z" fill="#adff2f" stroke="#000"/>
              <path d="M15,8 L15,24 L30,32 L30,16 Z" fill="#6b8e23" stroke="#000"/>
              <path d="M30,16 L30,32 L45,24 L45,8 Z" fill="#ccff00" stroke="#000"/>
            </g>
          </g>
        ` }
      ];
      const config = configs[Math.floor(Math.random() * configs.length)];
      answer = config.count;

      questionHtml = `
        <div class="geometry-q">
          <p>كم عدد المكعبات ثلاثية الأبعاد المكدسة لتشكيل هذا المجسم السحري؟</p>
          <div class="geometry-canvas">
            <svg viewBox="0 0 120 100" width="150" height="130">${config.svg}</svg>
          </div>
        </div>
      `;
      options = [answer, answer - 1, answer + 1, answer + 2];
      options = this.shuffleArray([...new Set(options)]);
      hint = `تخيل كيف يتم بناء المجسم: انظر إلى القواعد الأرضية (الأعمدة السفلى) وعدد المكعبات فوقها لتجنب تفويت أي مكعب مخفي يحمل الذي فوقه!`;

    } else {
      // Geometry angles / symmetry
      const isSymmetry = Math.random() > 0.5;
      if (isSymmetry) {
        const symmetrical = [
          { name: 'الفراشة', isSym: 'نعم', svg: '<path d="M10,50 Q30,20 50,50 Q70,20 90,50 Q70,80 50,50 Q30,80 10,50 Z" stroke="#ff4a7d" stroke-width="3" fill="rgba(255, 74, 125, 0.2)"/><line x1="50" y1="10" x2="50" y2="90" stroke="#ffffff" stroke-width="2" stroke-dasharray="4"/>' },
          { name: 'الشكل غير المنتظم', isSym: 'لا', svg: '<path d="M10,20 Q40,10 80,40 Q90,90 60,80 Q20,70 10,20 Z" stroke="#ff4a7d" stroke-width="3" fill="rgba(255, 74, 125, 0.2)"/><line x1="50" y1="10" x2="50" y2="90" stroke="#ffffff" stroke-width="2" stroke-dasharray="4"/>' }
        ];
        const symObj = symmetrical[Math.floor(Math.random() * symmetrical.length)];
        answer = symObj.isSym;

        questionHtml = `
          <div class="geometry-q">
            <p>هل الخط الأبيض المتقطع يمثل <strong>محور تماثل</strong> (يقسم الشكل إلى نصفين متطابقين تماماً كالمرآة)؟</p>
            <div class="geometry-canvas">
              <svg viewBox="0 0 100 100" width="120" height="120">${symObj.svg}</svg>
            </div>
          </div>
        `;
        options = ['نعم', 'لا'];
        hint = `انظر للجانب الأيمن والأيسر: هل إذا طوينا الشكل حول الخط الأبيض، سينطبق الجزء الأيمن تماماً على الأيسر؟`;
      } else {
        // Angles comparison (Right, Acute, Obtuse)
        const angles = [
          { name: 'قائمة (90 درجة)', type: 'قائمة', svg: '<path d="M20,20 L20,80 L80,80" stroke="#00d2fc" stroke-width="4" fill="none"/><rect x="20" y="70" width="10" height="10" stroke="#00d2fc" stroke-width="1" fill="none"/>' },
          { name: 'حادة (أصغر من 90)', type: 'حادة', svg: '<path d="M70,25 L20,80 L80,80" stroke="#00d2fc" stroke-width="4" fill="none"/>' },
          { name: 'منفرجة (أكبر من 90)', type: 'منفرجة', svg: '<path d="M10,35 L20,80 L80,80" stroke="#00d2fc" stroke-width="4" fill="none"/>' }
        ];
        const ang = angles[Math.floor(Math.random() * angles.length)];
        answer = ang.type;

        questionHtml = `
          <div class="geometry-q">
            <p>ما نوع الزاوية الزرقاء الموضحة بالشكل أدناه؟</p>
            <div class="geometry-canvas">
              <svg viewBox="0 0 100 100" width="120" height="120">${ang.svg}</svg>
            </div>
          </div>
        `;
        options = ['حادة', 'قائمة', 'منفرجة'];
        hint = `تذكر: الزاوية القائمة مثل حرف L. الحادة أضيق منها، والمنفرجة أوسع ومفتوحة أكثر.`;
      }
    }

    return {
      questionHtml,
      options,
      correctIndex: options.indexOf(answer),
      hint,
      reward: 12 + level * 5
    };
  }

  // 4. Logic/Visual Puzzles (شاطئ الألغاز)
  generateLogic(level) {
    let options, answer, hint, questionHtml;

    if (level === 1) {
      // Basic Emoji Logic equation (System of equations but single variable scale)
      const val = Math.floor(Math.random() * 5) + 1; // 1-5
      const sum = val + val;
      answer = val;

      questionHtml = `
        <div class="logic-q">
          <p>لغز الفاكهة السحري! أوجد قيمة الموزة الواحدة 🍌:</p>
          <div class="logic-equations">
            <div class="eq-row">🍌 + 🍌 = ${sum}</div>
            <div class="eq-row">🍌 = ؟</div>
          </div>
        </div>
      `;
      options = this.generateChoices(answer);
      hint = `ابحث عن رقم إذا جمعته مع نفسه كان المجموع ${sum}. يمكنك فقط تقسيم الرقم ${sum} إلى نصفين متساويين!`;

    } else if (level === 2) {
      // Two-variable emoji equations
      const item1 = Math.floor(Math.random() * 5) + 3; // 3-7 (e.g. dragon)
      const item2 = Math.floor(Math.random() * 4) + 1; // 1-4 (e.g. star)
      const eq1 = item1 + item1; // 2 * item1
      const eq2 = item1 + item2;

      answer = item2;

      questionHtml = `
        <div class="logic-q">
          <p>حل اللغز المتسلسل لاكتشاف الرمز المفقود 🔑:</p>
          <div class="logic-equations">
            <div class="eq-row">🐉 + 🐉 = ${eq1}</div>
            <div class="eq-row">🐉 + 🔑 = ${eq2}</div>
            <div class="eq-row">🔑 = ؟</div>
          </div>
        </div>
      `;
      options = this.generateChoices(answer);
      hint = `من السطر الأول، التنين الواحد 🐉 يساوي نصف ${eq1}، أي ${item1}. الآن عوض قيمة التنين في السطر الثاني لتكتشف كم يتبقى للرمز 🔑 ليساوي المجموع ${eq2}.`;

    } else if (level === 3) {
      // Balance Scale Logic (الميزان)
      // Dragon + Gem balances 3 Gems. So Dragon = 2 Gems.
      const gemCount = Math.floor(Math.random() * 3) + 2; // 2-4 gems
      answer = gemCount; 

      questionHtml = `
        <div class="logic-q">
          <p>إذا كان الميزان متوازناً تماماً في الشكل الأول. كم عدد الجواهر 💎 اللازمة لموازنة التنين 🐉 الواحد؟</p>
          <div class="scale-visual">
            <div class="scale-item left">🐉 + 💎</div>
            <div class="scale-pivot">▲</div>
            <div class="scale-item right">${'💎'.repeat(gemCount + 1)}</div>
          </div>
        </div>
      `;

      options = [gemCount, gemCount - 1, gemCount + 1, gemCount + 2].filter(v => v > 0);
      options = this.shuffleArray([...new Set(options)]);
      hint = `تخيل أنك حذفت جوهرة واحدة 💎 من كفتي الميزان للحفاظ على التوازن. ماذا سيتبقى في الكفة اليسرى وماذا يوازيها في الكفة اليمنى؟`;

    } else {
      // Visual Math Grid puzzle
      // A matrix puzzle with missing number
      // Row 1: 2, 3, 5  (sum)
      // Row 2: 4, 1, 5
      // Row 3: 3, 3, ?
      const r3c1 = Math.floor(Math.random() * 5) + 1;
      const r3c2 = Math.floor(Math.random() * 5) + 1;
      answer = r3c1 + r3c2;

      questionHtml = `
        <div class="logic-q">
          <p>اكتشف القاعدة السرية التي تربط أرقام الصندوق، وأوجد الرقم المفقود (؟):</p>
          <div class="magic-matrix">
            <div class="matrix-row"><span>2</span><span>3</span><span>5</span></div>
            <div class="matrix-row"><span>4</span><span>1</span><span>5</span></div>
            <div class="matrix-row"><span>${r3c1}</span><span>${r3c2}</span><span class="highlight">؟</span></div>
          </div>
        </div>
      `;

      options = this.generateChoices(answer);
      hint = `انظر إلى الأسطر أفقياً: اجمع الرقم الأول مع الرقم الثاني في كل سطر لترى إن كان يعطي الرقم الثالث!`;
    }

    return {
      questionHtml,
      options,
      correctIndex: options.indexOf(answer),
      hint,
      reward: 15 + level * 5
    };
  }

  // Helper: generates 4 choices with 1 correct answer and 3 random but close values
  generateChoices(correctVal) {
    if (typeof correctVal === 'string') return [correctVal]; // handled manually for symbols
    
    let choices = [correctVal];
    const range = Math.max(5, Math.ceil(correctVal * 0.5));
    
    while (choices.length < 4) {
      let offset = Math.floor(Math.random() * (range * 2 + 1)) - range;
      let distraction = correctVal + offset;
      if (distraction >= 0 && !choices.includes(distraction)) {
        choices.push(distraction);
      }
    }
    
    return this.shuffleArray(choices);
  }

  // Helper: Shuffle array
  shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
}

// Export as global engine singleton
window.mathEngine = new MathEngine();
