// index.html 전용 JS (main.js와 충돌 방지)

// 즐겨찾기 관리 함수들
function getFavorites() {
  const favorites = localStorage.getItem('facilityFavorites');
  return favorites ? JSON.parse(favorites) : [];
}

function addToFavorites(facility) {
  const favorites = getFavorites();
  if (!favorites.find(f => f.id === facility.id)) {
    favorites.push(facility);
    localStorage.setItem('facilityFavorites', JSON.stringify(favorites));
  }
}

function removeFromFavorites(facilityId) {
  const favorites = getFavorites();
  const updatedFavorites = favorites.filter(f => f.id !== facilityId);
  localStorage.setItem('facilityFavorites', JSON.stringify(updatedFavorites));
}

function isFavorite(facilityId) {
  const favorites = getFavorites();
  // facilityId가 숫자로 처리되도록 하여 일관된 비교를 보장합니다.
  return favorites.some(f => f.id == facilityId);
}

// 10개 단위 페이지네이션
function indexRenderFacilityPagination(total, page, perPage) {
  const pagDiv = document.getElementById('facilityPagination');
  if (!pagDiv) return;

  const maxPage = Math.ceil(total / perPage);
  const groupSize = 10;
  const totalPages = maxPage;

  let html = '';
  const groupIdx = Math.floor((page - 1) / groupSize);
  const groupStart = groupIdx * groupSize + 1;
  const groupEnd = Math.min(groupStart + groupSize - 1, totalPages);

  if (groupStart > 1) {
    html += `<a href="#" class="page-prev-group" data-page="${groupStart - 1}">&lt;</a>`;
  }

  for (let i = groupStart; i <= groupEnd; i++) {
    html += `<a href="#" class="${i === page ? 'active' : ''}" data-page="${i}">${i}</a>`;
  }

  if (groupEnd < totalPages) {
    html += `<a href="#" class="page-next-group" data-page="${groupEnd + 1}">&gt;</a>`;
  }

  pagDiv.className = 'facility-pagination';
  pagDiv.innerHTML = html;

  // 페이지네이션 링크 이벤트 바인딩
  pagDiv.querySelectorAll('a[data-page]').forEach(a => {
    a.onclick = function(e) {
      e.preventDefault();
      this.blur();
      indexRenderFacilitiesTablePaged(window.indexCurrentFacilityList, parseInt(this.dataset.page), perPage);
    };
  });
}

// 페이징된 ul/li 리스트 렌더링 (이미지 스타일)
window.indexCurrentFacilityList = []; // 현재 표시되는 목록 (페이지네이션용)
let initialFacilityData = []; // 필터링되지 않은 전체 시설 데이터

function indexRenderFacilitiesTablePaged(list, page = 1, perPage = 10) {
  window.indexCurrentFacilityList = list;
  const startIdx = (page - 1) * perPage;
  const pageList = list.slice(startIdx, startIdx + perPage);
  indexRenderFacilitiesList(pageList);
  indexRenderFacilityPagination(list.length, page, perPage);
}

// ul/li 구조로 시설 리스트 렌더링
function indexRenderFacilitiesList(list) {
  const container = document.getElementById('facilityList');
  if (!container) return;

  container.innerHTML = ''; // 이전 목록 항목 지우기

  if (!list || list.length === 0) {
    container.innerHTML = '<li style="padding:32px 0;text-align:center;color:#888;">해당 지역의 요양원이 없습니다.</li>';
    const facilityCountSpan = document.querySelector('.facility-count');
    if (facilityCountSpan) {
      facilityCountSpan.textContent = '0개';
    }
    return;
  }

  list.forEach((fac) => {
    // id가 숫자형으로 일관되게 비교되도록 합니다.
    const id = Number(fac.id);
    const isFav = isFavorite(id);
    const imageUrl = fac.image || 'img/default.jpg'; // 'image' 속성 또는 'imageUrl'을 대체로 사용합니다.

    container.innerHTML += `
      <li class="facility-item" style="cursor: pointer;" onclick="window.location.href='/facilities/${id}'">
        <img src="${imageUrl}" alt="시설사진" class="facility-thumb">
        <div class="facility-info">
          <div class="facility-name">${fac.name}</div>
          <div class="facility-addr">${fac.address}</div>
          <div class="facility-tel">전화번호 <span>${fac.phone}</span></div>
        </div>
        <input type="checkbox" id="scrap${id}" class="facility-fav-chk" ${isFav ? 'checked' : ''} data-facility-id="${id}">
        <label for="scrap${id}" class="facility-fav-label"></label>
        <input type="checkbox" id="heart${id}" class="facility-heart-chk" data-facility-id="${id}">
        <label for="heart${id}" class="facility-heart-label"></label>
      </li>
    `;
  });



  const facilityCountSpan = document.querySelector('.facility-count');
  if (facilityCountSpan) {
    facilityCountSpan.textContent = list.length + '개';
  }

  // 즐겨찾기 체크박스 이벤트 추가
  container.querySelectorAll('.facility-fav-chk').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const facilityId = parseInt(this.dataset.facilityId);
      // initialFacilityData에서 시설을 찾습니다.
      const facility = initialFacilityData.find(f => Number(f.id) === facilityId);

      if (this.checked) {
        // 즐겨찾기 추가
        if (facility) {
          addToFavorites({
            id: facilityId,
            name: facility.name,
            address: facility.address,
            phone: facility.phone,
            image: facility.image || 'img/default.jpg'
          });
        }
      } else {
        // 즐겨찾기 제거
        removeFromFavorites(facilityId);
      }
      // 즐겨찾기에 추가된 경우 마이페이지로 이동
      if (this.checked) {
        setTimeout(() => {
          if (confirm('즐겨찾기에 추가되었습니다. 마이페이지에서 확인하시겠습니까?')) {
            window.location.href = '/favorite';
          }
        }, 100);
      }
    });

    // 즐겨찾기 체크박스 클릭 시 이벤트 전파 방지
    checkbox.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  });

  // 하트 체크박스 이벤트 추가
  container.querySelectorAll('.facility-heart-chk').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const facilityId = parseInt(this.dataset.facilityId);
      const facility = initialFacilityData.find(f => Number(f.id) === facilityId);

      if (this.checked) {
        // 최대 3개까지만 선택 가능
        const selectedHearts = document.querySelectorAll('.facility-heart-chk:checked');
        if (selectedHearts.length > 3) {
          this.checked = false;
          alert('최대 3개까지만 선택할 수 있습니다.');
          return;
        }

        // 하트 추가 기능 - 비교담기 버튼에 표시
        console.log('하트 추가:', facility.name);
        saveHeartSelections();
        updateCompareButton();
        updateCompareSidebar();
      } else {
        // 하트 제거 기능
        console.log('하트 제거:', facility.name);
        saveHeartSelections();
        updateCompareButton();
        updateCompareSidebar();
      }
    });

    // 하트 체크박스 클릭 시 이벤트 전파 방지
    checkbox.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  });
}

// 하트 선택 상태를 localStorage에 저장
function saveHeartSelections() {
  const selectedHearts = document.querySelectorAll('.facility-heart-chk:checked');
  const heartSelections = [];

  selectedHearts.forEach(checkbox => {
    const facilityId = parseInt(checkbox.dataset.facilityId);
    heartSelections.push(facilityId);
  });

  localStorage.setItem('heartSelections', JSON.stringify(heartSelections));
}

// localStorage에서 하트 선택 상태 복원
function restoreHeartSelections() {
  const heartSelections = JSON.parse(localStorage.getItem('heartSelections') || '[]');

  heartSelections.forEach(facilityId => {
    const checkbox = document.querySelector(`.facility-heart-chk[data-facility-id="${facilityId}"]`);
    if (checkbox) {
      checkbox.checked = true;
    }
  });
}

function showCompareSidebar() {
  const sidebar = document.getElementById('compareSidebar');
  const collapsedBtn = document.getElementById('collapsedSidebarBtn');
  if (sidebar) {
    sidebar.classList.add('show');
  }
  // 사이드바가 열릴 때 접힌 버튼 숨기기
  if (collapsedBtn) {
    collapsedBtn.classList.remove('show');
  }
}

function hideCompareSidebar() {
  const sidebar = document.getElementById('compareSidebar');
  const collapsedBtn = document.getElementById('collapsedSidebarBtn');
  if (sidebar) {
    sidebar.classList.remove('show');
  }
  // 사이드바가 닫힐 때 접힌 버튼 표시
  if (collapsedBtn) {
    collapsedBtn.classList.add('show');
  }
}

function updateCompareSidebar() {
  const selectedHearts = document.querySelectorAll('.facility-heart-chk:checked');
  const compareList = document.getElementById('compareList');
  const compareCount = document.getElementById('compareCount');

  if (!compareList || !compareCount) return;

  // 카운트 업데이트
  compareCount.textContent = selectedHearts.length;

  // 사이드바 표시 여부 결정 (사이드바가 열려 있을 때는 숨기지 않음)
  if (selectedHearts.length > 0) {
    // 하트가 하나라도 선택되어 있으면 '비교' 버튼을 항상 표시하고,
    // 사이드바가 열려있을 때만 '비교' 버튼을 숨깁니다.
    // collapsedBtn의 'show' 클래스 토글은 showCompareSidebar/hideCompareSidebar에서 처리됩니다.
    showCompareSidebar();
  } else {
    hideCompareSidebar(); // 선택된 하트가 없으면 사이드바 숨김
  }

  // 비교 목록 업데이트
  compareList.innerHTML = '';

  if (selectedHearts.length === 0) {
    compareList.classList.add('empty');
    return;
  }

  compareList.classList.remove('empty');

  selectedHearts.forEach(checkbox => {
    const facilityId = parseInt(checkbox.dataset.facilityId);
    // initialFacilityData에서 시설을 찾습니다.
    const facility = initialFacilityData.find(f => Number(f.id) === facilityId);

    if (facility) {
      const compareItem = document.createElement('div');
      compareItem.className = 'compare-item';
      compareItem.innerHTML = `
        <img src="${facility.image || 'img/default.jpg'}" alt="${facility.name}" class="compare-item-image">
        <div class="compare-item-info">
          <div class="compare-item-name">${facility.name}</div>
          <div class="compare-item-address">${facility.address}</div>
          <div class="compare-item-phone">${facility.phone}</div>
        </div>
        <button class="remove-item-btn" data-facility-id="${facilityId}">×</button>
      `;

      compareList.appendChild(compareItem);
    }
  });

  // 삭제 버튼 이벤트 추가
  compareList.querySelectorAll('.remove-item-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const facilityId = parseInt(this.dataset.facilityId);
      const checkbox = document.querySelector(`.facility-heart-chk[data-facility-id="${facilityId}"]`);
      if (checkbox) {
        checkbox.checked = false;
        saveHeartSelections();
        updateCompareButton();
        updateCompareSidebar();
      }
    });
  });
}

// 비교담기 버튼 업데이트 함수
function updateCompareButton() {
  const compareBtn = document.getElementById('compare-btn'); // 이 ID는 현재 코드에 없음. collapsedSidebarBtn이 그 역할?
  const collapsedCount = document.getElementById('collapsedCount');
  const selectedHearts = document.querySelectorAll('.facility-heart-chk:checked');

  // '비교' 버튼 (collapsedSidebarBtn)의 숫자 업데이트
  if (collapsedCount) {
    collapsedCount.textContent = selectedHearts.length;
  }

  // '비교' 버튼의 빨간색 뱃지 로직 (이전 코드에 있던 compare-btn 관련 로직을 collapsedSidebarBtn에 적용)
  const collapsedSidebarBtn = document.getElementById('collapsedSidebarBtn');
  if (collapsedSidebarBtn) {
    const existingBadge = collapsedSidebarBtn.querySelector('.compare-badge');
    if (existingBadge) {
      existingBadge.remove();
    }

    if (selectedHearts.length > 0) {
      const badge = document.createElement('div');
      badge.className = 'compare-badge';
      badge.style.cssText = `
        position: absolute;
        top: -5px;
        right: 5px;
        width: 12px;
        height: 12px;
        background: #ff4444;
        border-radius: 50%;
        border: 2px solid #fff;
        z-index: 10;
      `;
      collapsedSidebarBtn.style.position = 'relative';
      collapsedSidebarBtn.appendChild(badge);
    }
  }
}

// 초기 시설 데이터를 설정하고 렌더링을 시작하는 함수
function initializeFacilityData(data) {
  initialFacilityData = data;
  indexRenderFacilitiesTablePaged(initialFacilityData, 1, 10);
  // 초기 데이터 로드 후 하트 선택 상태 복원 및 비교담기 버튼 업데이트
  setTimeout(() => {
    restoreHeartSelections();
    updateCompareButton();
    updateCompareSidebar(); // 사이드바 초기 상태 업데이트 (선택된 항목이 있으면 표시)
  }, 100);
}


// 정렬 버튼, 지역 필터, SVG 지도, 체크박스 등 index.html 전용 이벤트
window.addEventListener('DOMContentLoaded', function() {
  // 정렬 버튼
  const sortBtns = document.querySelectorAll('.facility-sort-btn');
  sortBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      sortBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // 지역 선택 (체크박스)
  const regionCheckboxes = document.querySelectorAll('.region-item input[type="checkbox"]');
  const regionToSvgId = {
    '서울': 'KR11',
    '경기도': 'KR41',
    '강원도': 'KR42',
    '경상도': ['KR47', 'KR48', 'KR31', 'KR26'],
    '전라도': ['KR45', 'KR46', 'KR29'],
    '충청도': ['KR43', 'KR44', 'KR50', 'KR30'],
    '인천': 'KR28',
    '대전': 'KR30',
    '대구': 'KR27',
    '울산': 'KR31',
    '부산': 'KR26',
    '제주도': 'KR49'
  };
  const svgObj = document.getElementById('krMapObj');

  /*function highlightAndFilterRegion(regionKor) {
    regionCheckboxes.forEach(cb => {
      cb.checked = (cb.value === regionKor);
    });
    colorRegions();
    const filtered = initialFacilityData.filter(fac => fac.address.includes(regionKor));
    indexRenderFacilitiesTablePaged(filtered.length ? filtered : initialFacilityData, 1, 10);
  }*/

  function highlightAndFilterRegion(regionKor) {
    regionCheckboxes.forEach(cb => {
      cb.checked = (cb.value === regionKor);
    });
    colorRegions();
    const filtered = initialFacilityData.filter(fac => {
      if (regionKor === '강원도') {
        return fac.address.includes('강원도') || fac.address.includes('강원특별자치도');
      } else if (regionKor === '경상도') {
        return fac.address.includes('경상도') || fac.address.includes('경상북도') || fac.address.includes('경상남도');
      } else if (regionKor === '전라도') {
        return fac.address.includes('경상도') || fac.address.includes('전라북도') || fac.address.includes('전북특별자치도') || fac.address.includes('전라남도');
      } else if (regionKor === '충청도') {
        return fac.address.includes('충청도') || fac.address.includes('충청북도') || fac.address.includes('충청남도');
      } else if (regionKor === '제주도') {
        return fac.address.includes('충청도') || fac.address.includes('제주특별자치도');
      }
      return fac.address.includes(regionKor);
    });

  indexRenderFacilitiesTablePaged(filtered, 1, 10);
}

  function colorRegions() {
    Object.values(regionToSvgId).flat().forEach(id => {
      const path = svgObj?.contentDocument?.getElementById(id);
      if (path) path.setAttribute('fill', 'none');
    });
    regionCheckboxes.forEach(cb => {
      if (cb.checked) {
        let ids = regionToSvgId[cb.value];
        if (!ids) return;
        if (!Array.isArray(ids)) ids = [ids];
        ids.forEach(id => {
          const path = svgObj?.contentDocument?.getElementById(id);
          if (path) path.setAttribute('fill', '#e6f0fa');
        });
      }
    });
  }

  regionCheckboxes.forEach(cb => {
    cb.addEventListener('change', function() {
      if (this.checked) {
        highlightAndFilterRegion(this.value);
      } else {
        const anyChecked = Array.from(regionCheckboxes).some(checkbox => checkbox.checked);
        if (!anyChecked) {
          indexRenderFacilitiesTablePaged(initialFacilityData, 1, 10);
          colorRegions(); // 체크된 항목이 없으면 모든 지도를 초기화
        }
      }
    });
  });

  // SVG 지도 path 클릭 이벤트
  if (svgObj) {
    svgObj.addEventListener('load', function() {
      const svgDoc = svgObj.contentDocument;
      if (!svgDoc) return;
      Object.entries(regionToSvgId).forEach(([regionKor, ids]) => {
        if (!Array.isArray(ids)) ids = [ids];
        ids.forEach(id => {
          const regionPath = svgDoc.getElementById(id);
          if (regionPath) {
            regionPath.style.cursor = 'pointer';
            regionPath.addEventListener('click', function() {
              regionCheckboxes.forEach(cb => {
                cb.checked = (cb.value === regionKor);
              });
              highlightAndFilterRegion(regionKor);
            });
            regionPath.addEventListener('mouseenter', function() {
              regionPath.setAttribute('fill', '#b3d1fa');
            });
            regionPath.addEventListener('mouseleave', function() {
              const checked = Array.from(regionCheckboxes).find(cb => cb.checked && regionToSvgId[cb.value]?.includes(id));
              if (!checked) regionPath.setAttribute('fill', 'none');
            });
          }
        });
      });
    });
  }

  // 검색 기능
  const searchInput = document.getElementById('facilitySearchInput');
  const searchBtn = document.getElementById('facilitySearchBtn');
  const searchForm = document.getElementById('facilitySearchForm');

  function doFacilitySearch() {
    const keyword = searchInput.value.trim();
    if (!keyword) {
      indexRenderFacilitiesTablePaged(initialFacilityData, 1, 10);
      return;
    }
    const filtered = initialFacilityData.filter(f => f.name.includes(keyword) || f.address.includes(keyword));
    indexRenderFacilitiesTablePaged(filtered, 1, 10);
  }
  searchBtn.addEventListener('click', doFacilitySearch);
  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      doFacilitySearch();
    }
  });
  searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    doFacilitySearch();
  });

  // 사이드바 이벤트 리스너들
  const closeSidebarBtn = document.getElementById('closeSidebar');
  const clearAllBtn = document.getElementById('clearAllBtn');
  const addFacilityBtn = document.getElementById('addFacilityBtn');
  const compareSearchBtn = document.getElementById('compareSearchBtn');

  if (closeSidebarBtn) {
    closeSidebarBtn.addEventListener('click', function() {
      hideCompareSidebar();
    });
  }

  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', function() {
      // 모든 하트 체크박스 해제
      document.querySelectorAll('.facility-heart-chk:checked').forEach(checkbox => {
        checkbox.checked = false;
      });
      saveHeartSelections();
      updateCompareButton();
      updateCompareSidebar();
    });
  }

  /*if (addFacilityBtn) {
    addFacilityBtn.addEventListener('click', function() {
      // 비교 페이지로 이동
      window.location.href = 'compare.html';
    });
  }*/
  if (addFacilityBtn) {
    addFacilityBtn.addEventListener('click', function() {
      // 1. localStorage에서 저장된 ID 목록을 가져옵니다.
      const heartSelections = JSON.parse(localStorage.getItem('heartSelections') || '[]');

      // 2. ID 목록이 비어있지 않은 경우에만 URL을 생성합니다.
      if (heartSelections.length > 0) {
        // 3. ID들을 URL 쿼리 파라미터로 변환합니다. (예: ?ids=1,2,3)
        const queryString = `?ids=${heartSelections.join(',')}`;

        // 4. compare 페이지로 이동합니다.
        window.location.href = `/compare${queryString}`;
      } else {
        // 선택된 항목이 없을 경우, 그냥 compare 페이지로 이동합니다.
        window.location.href = '/compare';
      }
    });
  }

  if (compareSearchBtn) {
    compareSearchBtn.addEventListener('click', function() {
      // VS 검색 기능 (현재는 알림만)
      alert('VS 검색 기능은 개발 중입니다.');
    });
  }

  // 접힌 사이드바 버튼 이벤트 리스너
  const collapsedSidebarBtn = document.getElementById('collapsedSidebarBtn');
  if (collapsedSidebarBtn) {
    collapsedSidebarBtn.addEventListener('click', function() {
      showCompareSidebar();
    });
  }
});