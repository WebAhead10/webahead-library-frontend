import { useRecoilValue } from 'recoil'
import { languageAtom } from 'utils/recoil/atoms'
import './about.css'

const About = () => {
  const languageObj = useRecoilValue(languageAtom)
  const lang = languageObj.language || 'en';
  if(lang === 'ar') {
  return (<div className="about-container-rtl">
    <header>
        <h1>من نحن</h1>
    </header>
    <section>
        <p>
            "نبش" هي مبادرة مجتمعية تسعى إلى النبش في تاريخ فلسطين المكتوب ما قبل تطور الحوسبة الرقمية، مع التركيز على فترة نهاية فترة الحكم العثماني وكل فترة الانتداب البريطاني، بهدف جعله أكثر إتاحة واستخدامًا لأغراض البحث والتعليم والإبداع والإنتاج. تأسست المبادرة عام 2022 على يد مجموعة من النشطاء الفلسطينيين المستقلين، وتهدف إلى رقمنة وتحويل المواد الأرشيفية، مثل الصحف القديمة والنشرات الإحصائية، إلى موارد رقمية يمكن البحث فيها والاستفادة منها بسهولة ومن ثم استعمال هذه المواد من أجل بناء مشاريع مختلفة.
        </p>
    </section>
    <section>
        <h2>مهمتنا</h2>
        <p>
            تتمثل مهمتنا في سد الفجوة بين الكم الهائل من المعلومات التاريخية المحفوظة في الأرشيف، والتحديات التي تعيق الوصول إليها واستخدامها. من خلال التعاون مع الأفراد والمؤسسات والجهات التعليمية، نطمح إلى تمكين المساهمة التطوعية، وتعزيز البحث التاريخي، وتعميق الفهم لتاريخ فلسطين.
        </p>
    </section>
    <section>
        <h2>لماذا "نبش"؟</h2>
        <p>
            توفر الوثائق الأرشيفية، مثل الصحف القديمة والسجلات الحكومية، مصدر معلومات قيّم عن التحولات الاجتماعية والحياة اليومية في فلسطين. ومع ذلك، يواجه الباحثون تحديات كبيرة عند التعامل مع هذه المواد، من أبرزها:
        </p>
        <ul>
            <li>التحديات التقنية: العديد من الوثائق متوفرة كصور أو ملفات مسح ضوئي، مما يحد من إمكانية استخدامها مع الأدوات الحديثة مثل الذكاء الاصطناعي والبرامج التحليلية.</li>
            <li>الحواجز اللغوية: تقنيات التعرف الضوئي على النصوص (OCR) باللغة العربية لا تزال متواضعة، مما يعقّد عملية رقمنة النصوص العربية القديمة.</li>
            <li>جودة البيانات: الوثائق التاريخية غالبًا ما تكون منخفضة الجودة، وتحتوي على أخطاء مطبعية أو كتابية تعيق معالجتها رقميًا.</li>
            <li>ضخامة حجم الأرشيف: الكم الكبير من المواد الأرشيفية يتطلب جهودًا جماعية لتحقيق تقدم ملموس.</li>
        </ul>
        <p>
            تواجه "نبش" هذه التحديات من خلال حلول مبتكرة قائمة على التعاون المجتمعي والتعليم. على سبيل المثال، نسّقنا مع طلاب المدارس الثانوية للمشاركة في فهرسة الصحف العربية، مما يساهم في إتاحة هذا المحتوى القيّم للأجيال القادمة.
        </p>
    </section>
    <section>
        <h2>منهجنا</h2>
        <p>
            للتغلب على العوائق وبناء قواعد بيانات قابلة للبحث، تعتمد "نبش" على الدمج بين المشاركة المجتمعية والتعليم. من خلال إشراك الطلاب والمتطوعين، نقدم لهم خبرة عملية في التعامل مع المصادر التاريخية الأولية، مما يثري تجربتهم التعليمية ويساهم في تحقيق أهداف المشروع.
        </p>
    </section>
    <section>
        <h2>مشاريعنا الحالية</h2>
        <p>نُركز في "نبش" على مجموعة متنوعة من المشاريع التي تلقي الضوء على جوانب مختلفة من تاريخ فلسطين، مثل:</p>
        <ul>
            <li>جرائم قتل النساء: توثيق الحالات ودراسة ردود الفعل المجتمعية.</li>
            <li>عقوبة الإعدام خلال الانتداب البريطاني: تحليل القضايا المرتبطة بهذه العقوبة.</li>
            <li>تكاليف المعيشة: استعراض الاتجاهات الاقتصادية من خلال الوثائق التاريخية.</li>
            <li>التعليم في فلسطين: توثيق البيانات التاريخية عن المدارس والتعليم.</li>
            <li>الإعلانات الصحفية: استكشاف الأنشطة الثقافية والتجارية في تلك الحقبة.</li>
        </ul>
    </section>
    <section>
        <h2>كيف يمكنك المشاركة؟</h2>
        <p>
            إذا كنت باحثًا، معلمًا، طالبًا، أو مهتمًا بتاريخ فلسطين، ندعوك للانضمام إلينا في "نبش" للمساهمة في حفظ هذا التاريخ الثري. معًا، يمكننا تحويل هذه الموارد إلى أدوات تعليمية وبحثية ومصدر إلهام للإبداع والإنتاج متاحة للجميع، مع تعزيز روح التعاون والتعلم والمشاركة الفعّالة.
        </p>
    </section>
 
     </div>
)} else {
  return (
    <div className="about-container-ltr">
      <header>
        <h1>About Us</h1>
      </header>
      <section>
        <p>
          "Nabesh" is a community initiative that seeks to dig into Palestine's written history before the development of digital computing, focusing on the late Ottoman period and the entire British Mandate period. The goal is to make it more accessible and usable for research, education, creativity, and production purposes. The initiative was founded in 2022 by a group of independent Palestinian activists. It aims to digitize and transform archival materials, such as old newspapers and statistical bulletins, into searchable and usable digital resources that can be leveraged for various projects.
        </p>
      </section>
      <section>
        <h2>Our Mission</h2>
        <p>
          Our mission is to bridge the gap between the vast amount of historical information preserved in archives and the challenges that hinder access and use. Through collaboration with individuals, institutions, and educational entities, we aim to enable voluntary contributions, enhance historical research, and deepen understanding of Palestine's history.
        </p>
      </section>
      <section>
        <h2>Why "Nabesh"?</h2>
        <p>
          Archival documents, such as old newspapers and government records, provide a valuable source of information about social changes and daily life in Palestine. However, researchers face significant challenges when dealing with these materials, including:
        </p>
        <ul>
          <li>Technical challenges: Many documents are available as images or scanned files, limiting their use with modern tools like AI and analytical software.</li>
          <li>Language barriers: Optical Character Recognition (OCR) technology for Arabic remains underdeveloped, complicating the digitization of old Arabic texts.</li>
          <li>Data quality: Historical documents are often of low quality and contain typographical or written errors, which hinder digital processing.</li>
          <li>Archive size: The sheer volume of archival materials requires collective efforts to make meaningful progress.</li>
        </ul>
        <p>
          "Nabesh" addresses these challenges through innovative, community-driven, and educational solutions. For example, we have coordinated with high school students to participate in indexing Arabic newspapers, contributing to the availability of this valuable content for future generations.
        </p>
      </section>
      <section>
        <h2>Our Approach</h2>
        <p>
          To overcome barriers and build searchable databases, "Nabesh" relies on integrating community participation and education. By engaging students and volunteers, we provide them with practical experience in handling primary historical sources, enriching their educational journey while advancing the project’s goals.
        </p>
      </section>
      <section>
        <h2>Our Current Projects</h2>
        <p>
          At "Nabesh," we focus on a variety of projects that shed light on different aspects of Palestine’s history, such as:
        </p>
        <ul>
          <li>Femicide cases: Documenting incidents and studying societal reactions.</li>
          <li>Capital punishment during the British Mandate: Analyzing cases related to this penalty.</li>
          <li>Cost of living: Reviewing economic trends through historical documents.</li>
          <li>Education in Palestine: Documenting historical data about schools and education.</li>
          <li>Press advertisements: Exploring cultural and commercial activities of the era.</li>
        </ul>
      </section>
      <section>
        <h2>How Can You Participate?</h2>
        <p>
          If you are a researcher, teacher, student, or someone interested in Palestine’s history, we invite you to join us at "Nabesh" to contribute to preserving this rich history. Together, we can transform these resources into educational and research tools, as well as sources of inspiration for creativity and production accessible to everyone, while fostering a spirit of collaboration, learning, and active participation.
        </p>
      </section>
    </div>
  )}
}

export default About
