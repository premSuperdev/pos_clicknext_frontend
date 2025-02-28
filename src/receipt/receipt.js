import { initLoader } from '../../plugins/loading.js'
const body = document.getElementById('bodyPage')
const loader = initLoader(body)
import * as ReceiptApi from '../../plugins/api/receiptApi.js'
const _startDate = document.getElementById('startDate')
const _endDate = document.getElementById('endDate')
const tBody = document.getElementById('receiptTbody')
const templateNoData = document.getElementById('templateNoData')
const templateRowTable = document.getElementById('templateRowTable')
const dataTable = document.getElementById('receiptTable')
const searchButton = document.getElementById('searchButton')
import { initToast } from '../../plugins/toast.js'
const toast = initToast(body)
const date = new Date()
const dateTime = `${date.getFullYear()}-${
  (date.getMonth() + 1).toString().length > 1 ? '' : 0
}${date.getMonth() + 1}-${
  date.getDate().toString().length >= 1 ? '' : 0
}${date.getDate()}`
const beforeOneDayTime = `${date.getFullYear()}-${
  (date.getMonth() + 1).toString().length > 1 ? '' : 0
}${date.getMonth() + 1}-${
  (date.getDate() - 1).toString().length >= 1 ? '' : 0
}${date.getDate() - 1}`

const startDate = {
  get value() {
    return _startDate.value
  },
  set value(x) {
    _startDate.value = x
  },
}
const endDate = {
  get value() {
    return _endDate.value
  },
  set value(x) {
    _endDate.value = x
  },
}

function validationDate(start, end) {
  let date1 = new Date(start).getTime()
  let date2 = new Date(end).getTime()
  return date1 <= date2
}

async function search() {
  loader.setLoadingOn()
  if (startDate.value == '' || endDate.value == '') {
    toast.error('ข้อมูลผิดรูปแบบ', 'กรุณาเลือกวันที่ให้ครบสองอัน')
    return
  }
  if (validationDate(startDate.value, endDate.value)) {
    tBody.innerHTML = ''
    const { statusCode, data } = await ReceiptApi.getAllreceipt(
      startDate.value,
      endDate.value,
    )
    if (statusCode == 200) {
      if (data.length > 0) {
        data.forEach((receipt) => {
          const tr = createTableRow(receipt.receiptId)
          assignValueToDataTable(tr, receipt)
        })
      } else {
        console.log('no')
        loadNodata()
      }
    } else {
      loadNodata()
    }
  } else {
    toast.error('ข้อมูลผิดรูปแบบ', 'กรุณาเลือกวันเริ่มต้นก่อนวันสิ้นสุด')
  }
  loader.setLoadingOff()
}

function assignValueToDataTable(tr, item) {
  const rowReceiptCode = tr.querySelector('.rowReceiptCode')
  const rowReceiptDate = tr.querySelector('.rowReceiptDate')
  const rowReceiptGrandPrice = tr.querySelector('.rowReceiptGrandPrice')
  rowReceiptCode.textContent = item.receiptCode
  rowReceiptDate.textContent = item.receiptDate
  rowReceiptGrandPrice.textContent = item.receiptGrandTotal
  tBody.appendChild(tr)
}
function createTableRow(id) {
  const tr = document.createElement('tr')
  const clone = templateRowTable.content.cloneNode(true)
  tr.appendChild(clone)
  tr.dataset.counterIdx = id
  const rowReceiptDetails = tr.querySelector('.rowReceiptDetails')
  rowReceiptDetails.addEventListener('click', () => detailsClick(id))
  const rowNumber = tr.querySelector('.rowNumber')
  rowNumber.textContent = dataTable.rows.length
  tBody.appendChild(tr)
  return tr
}
function detailsClick(id) {
  window.location.href = `../receiptDetail/receiptDetail.html?receiptId=${id}`
}
async function onPageLoad() {
  loader.setLoadingOn()
  startDate.value = beforeOneDayTime
  endDate.value = dateTime
  const { statusCode, data } = await ReceiptApi.getAllreceipt(
    startDate.value,
    endDate.value,
  )
  if (statusCode == 200) {
    console.log('ds')
    console.log(data)
    if (data.length > 0) {
      data.forEach((receipt) => {
        const tr = createTableRow(receipt.receiptId)
        assignValueToDataTable(tr, receipt)
      })
    } else {
      console.log('no')
      loadNodata()
    }
  } else {
    loadNodata()
  }
  searchButton.addEventListener('click', search)
  loader.setLoadingOff()
}
function loadNodata() {
  const clone = templateNoData.content.cloneNode(true)
  tBody.appendChild(clone)
}
onPageLoad()
