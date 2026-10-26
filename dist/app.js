(() => {
  'use strict';
  const data = window.ELM_COURSE_DATA;
  const $ = id => document.getElementById(id);
  const coordinates = {
    east: [[807,526],[725,368],[630,307],[507,261],[300,234],[414,324],[695,418],[708,492],[764,623],[679,611],[475,486],[241,442],[118,329],[263,346],[521,440],[646,660],[588,704],[655,757]],
    west: [[1060,717],[1199,472],[1290,292],[1301,425],[1377,376],[1452,389],[1442,529],[1216,632],[1005,775],[965,542],[1018,593],[1082,630],[1154,410],[1107,267],[932,258],[1023,334],[942,399],[887,578]]
  };
  const tees = {champion:'チャンピオン', regular:'レギュラー', front:'フロント'};
  const abbreviations = {champion:'C.T.',regular:'R.T.',front:'F.T.'};
  const state = {course:'east',hole:1,tee:'regular',green:'right',photo:0,media:'photo',zoom:1};
  let lastTrigger = null;
  let currentMedia = null;
  const mobile = () => window.matchMedia('(max-width: 850px)').matches;
  const holeData = () => data.courses[state.course].holes.find(h=>h.number===state.hole);
  const yards = h => state.course==='west' ? h.yardages[state.green] : h.yardages;
  const courseLabel = () => data.courses[state.course].label;
  const pressed = (container, attribute, value) => container.querySelectorAll(`[data-${attribute}]`).forEach(b=>{const active=b.dataset[attribute]===value;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
  function setSheet(open){
    $('detail').classList.toggle('is-open',open);
    $('sheetBackdrop').hidden=!open;
    document.body.style.overflow=open&&mobile()?'hidden':'';
    if(open&&mobile()){
      $('detail').setAttribute('role','dialog');$('detail').setAttribute('aria-modal','true');
      $('closeDetail').focus({preventScroll:true});
    }else{
      $('detail').removeAttribute('role');$('detail').removeAttribute('aria-modal');
      if(lastTrigger&&mobile()){
        const target=lastTrigger.isConnected?lastTrigger:document.querySelector(`.hotspot[data-course="${state.course}"][data-hole="${state.hole}"]`);
        if(target)target.focus({preventScroll:true});
      }
    }
  }
  function showHole(course,number,open=true,trigger=null){
    state.course=course;state.hole=number;state.photo=0;state.media='photo';
    if(trigger)lastTrigger=trigger;
    render();
    history.replaceState(null,'',`#${course}-${number}`);
    if(open&&mobile())setSheet(true);
  }
  function render(){
    const h=holeData(), values=yards(h), label=courseLabel();
    const accent=state.course==='east'?'#315b78':'#9a4864';
    const soft=state.course==='east'?'#eff4f7':'#f9f0f3';
    document.documentElement.style.setProperty('--accent',accent);
    document.documentElement.style.setProperty('--soft',soft);
    $('detail').style.setProperty('--accent',accent);
    $('courseName').replaceChildren(document.createTextNode(label+' '));
    const segment=document.createElement('span');segment.textContent=state.hole<=9?'OUT':'IN';$('courseName').append(segment);
    $('holeNumber').textContent=state.hole;$('par').textContent=h.par;
    $('yardage').textContent=values[state.tee];
    $('distanceLabel').textContent=tees[state.tee]+'ティー';
    $('greenSummary').textContent=state.course==='west'?(state.green==='right'?'右グリーン':'左グリーン'):'1グリーン';
    $('greenField').hidden=state.course!=='west';
    $('selectionLabel').textContent=`${label} ${state.hole}番を表示中`;
    pressed(document.querySelector('.course-tabs'),'course',state.course);
    pressed($('teeOptions'),'tee',state.tee);pressed($('greenField'),'green',state.green);
    $('hotspots').querySelectorAll('button').forEach(b=>{const active=b.dataset.course===state.course&&+b.dataset.hole===state.hole;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
    $('holeRows').replaceChildren();
    for(let row=0;row<2;row++){
      const div=document.createElement('div');div.className='hole-row';const tag=document.createElement('span');tag.textContent=row?'IN':'OUT';div.append(tag);
      for(let n=1+row*9;n<=9+row*9;n++){
        const b=document.createElement('button');b.textContent=n;b.className=n===state.hole?'active':'';
        b.setAttribute('aria-label',`${label} ${n}番ホールの詳細`);b.setAttribute('aria-pressed',String(n===state.hole));
        b.addEventListener('click',()=>showHole(state.course,n,true,b));div.append(b);
      }$('holeRows').append(div);
    }
    $('yardageTable').replaceChildren();
    for(const key of Object.keys(tees)){
      const div=document.createElement('div');if(key===state.tee)div.className='selected';
      const labelEl=document.createElement('span');labelEl.textContent=abbreviations[key];
      const v=document.createElement('strong');v.append(document.createTextNode(values[key]));const unit=document.createElement('small');unit.textContent='yd';v.append(unit);div.append(labelEl,v);$('yardageTable').append(div);
    }
    $('prevHole').disabled=state.hole===1;$('nextHole').disabled=state.hole===18;
    $('yardageSource').href=h.sourceUrl;
    renderMedia();
    $('announcement').textContent=`${label} ${state.hole}番、パー${h.par}、${tees[state.tee]}ティー ${values[state.tee]}ヤード${state.course==='west'?'、'+$('greenSummary').textContent:''}`;
  }
  function renderMedia(){
    const h=holeData(),photos=h.photos||[];
    if(state.media==='photo'&&!photos.length&&h.diagram)state.media='diagram';
    if(state.media==='diagram'&&!h.diagram)state.media='photo';
    const buttons=$('mediaTabs').querySelectorAll('button');buttons[0].disabled=!photos.length;buttons[1].disabled=!h.diagram;
    pressed($('mediaTabs'),'media',state.media);
    const media=state.media==='diagram'?h.diagram:photos[state.photo%Math.max(photos.length,1)];currentMedia=media||null;
    $('openMedia').hidden=!media;$('mediaEmpty').hidden=!!media;
    $('mediaNavigation').hidden=state.media!=='photo'||photos.length<2;
    $('openMedia').classList.toggle('diagram',state.media==='diagram');
    if(media){
      const caption=media.caption||(state.media==='diagram'?'公式ガイドのコース図':'コース写真');
      const alt=`${courseLabel()} ${state.hole}番ホール：${caption}`;
      $('holeImage').alt=alt;$('holeImage').src=media.src;
      $('photoCaption').textContent=caption;
      $('photoCount').textContent=`${state.photo+1} / ${photos.length}`;
      $('mediaSource').hidden=false;$('mediaSource').href=media.sourceUrl||h.sourceUrl;
      $('mediaSource').textContent=state.media==='diagram'?'コース図：公式ガイドPDF ↗':'写真：楽天GORA ↗';
    }else{$('photoCaption').textContent='';$('mediaSource').hidden=true;}
  }
  for(const [course,points] of Object.entries(coordinates))points.forEach(([x,y],i)=>{
    const b=document.createElement('button');b.className='hotspot';b.dataset.course=course;b.dataset.hole=i+1;
    b.style.left=(x/1609*100)+'%';b.style.top=(y/978*100)+'%';
    b.setAttribute('aria-label',`${data.courses[course].label} ${i+1}番ホールの距離と写真`);
    b.title=`${data.courses[course].label} ${i+1}番`;b.addEventListener('click',()=>showHole(course,i+1,true,b));$('hotspots').append(b);
  });
  document.querySelectorAll('[data-course]').forEach(b=>{if(!b.classList.contains('hotspot'))b.addEventListener('click',()=>showHole(b.dataset.course,state.hole,false));});
  $('teeOptions').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{state.tee=b.dataset.tee;render();}));
  $('greenField').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{state.green=b.dataset.green;render();}));
  $('mediaTabs').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{state.media=b.dataset.media;renderMedia();}));
  $('prevHole').addEventListener('click',()=>{if(state.hole>1)showHole(state.course,state.hole-1,false);});
  $('nextHole').addEventListener('click',()=>{if(state.hole<18)showHole(state.course,state.hole+1,false);});
  function movePhoto(delta){const n=holeData().photos.length;if(n){state.photo=(state.photo+delta+n)%n;renderMedia();}}
  $('prevPhoto').addEventListener('click',()=>movePhoto(-1));$('nextPhoto').addEventListener('click',()=>movePhoto(1));
  $('holeImage').addEventListener('error',()=>{$('openMedia').hidden=true;$('mediaEmpty').hidden=false;$('mediaEmpty').textContent='画像を読み込めませんでした。下の出典リンクからご確認ください。';});
  $('openMedia').addEventListener('click',()=>{if(!currentMedia)return;$('largeImage').src=currentMedia.src;$('largeImage').alt=$('holeImage').alt;$('dialogTitle').textContent=$('holeImage').alt;$('imageDialog').showModal();});
  $('closeDialog').addEventListener('click',()=>$('imageDialog').close());
  $('imageDialog').addEventListener('click',e=>{if(e.target===$('imageDialog'))$('imageDialog').close();});
  $('closeDetail').addEventListener('click',()=>setSheet(false));$('sheetBackdrop').addEventListener('click',()=>setSheet(false));
  document.addEventListener('keydown',e=>{
    if($('imageDialog').open)return;
    if(e.key==='Escape'&&$('detail').classList.contains('is-open'))setSheet(false);
    if(e.key==='Tab'&&mobile()&&$('detail').classList.contains('is-open')){
      const all=[...$('detail').querySelectorAll('button:not(:disabled),a[href]')].filter(el=>el.getClientRects().length);
      const first=all[0],last=all[all.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    }
  });
  window.addEventListener('resize',()=>{if(!mobile())setSheet(false);});
  function zoom(value){state.zoom=Math.max(1,Math.min(2,value));$('mapStage').style.width=(state.zoom*100)+'%';$('zoomReset').textContent=Math.round(state.zoom*100)+'%';$('zoomOut').disabled=state.zoom===1;$('zoomIn').disabled=state.zoom===2;}
  $('zoomIn').addEventListener('click',()=>zoom(state.zoom+.25));$('zoomOut').addEventListener('click',()=>zoom(state.zoom-.25));$('zoomReset').addEventListener('click',()=>zoom(1));
  const match=location.hash.match(/^#(east|west)-(\d+)$/);if(match&&+match[2]>=1&&+match[2]<=18){state.course=match[1];state.hole=+match[2];}
  render();zoom(1);
  if(mobile()){$('mapViewport').scrollLeft=200;}
})();
