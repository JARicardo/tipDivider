<template>
  <v-app>
    <SideBar />

    <!-- HEADER -->
    <v-app-bar flat color="white" class="elevation-1">
      <v-btn icon @click="goBack" v-if="showBackButton">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>

      <v-toolbar-title class="text-h6 font-weight-bold">
        {{ title }}
      </v-toolbar-title>

      <v-spacer />
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <v-row class="d-flex align-stretch">
          <!-- Column 1: Amount, Waiters, Payment Method -->
          <v-col cols="12" md="4" class="d-flex">
            <v-card class="pa-4 flex-grow-1">
              <v-card-title class="d-flex justify-space-between align-center">
                <span class="text-h6">Amount</span>
                <v-btn icon @click="saveTip">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </v-card-title>

              <v-card-text>
                <v-text-field v-model="amount" label="Enter amount" prefix="$" type="number" :disabled="!isEditing"
                  hide-details class="mt-2" />
              </v-card-text>

              <div class="mt-6">
                <div class="mb-2 font-weight-medium">
                  ¿Entre cuántos quieres dividir la propina?
                </div>

                <v-row align="center">
                  <v-col cols="6">
                    <v-text-field v-model.number="waiters" type="number" label="Nº Personas" min="1" hide-details />
                  </v-col>

                  <v-col cols="6">
                    <v-chip class="ma-2" color="primary" variant="elevated" size="large">
                      {{ formattedResult }} x persona
                    </v-chip>
                  </v-col>
                </v-row>
              </div>

              <div class="mt-6">
                <div class="mb-2 font-weight-medium">Método de Pago</div>

                <v-btn-toggle v-model="paymentMethod" mandatory class="d-flex flex-wrap" divided>
                  <v-btn v-for="(method, index) in paymentMethods" :key="index" :value="method.value" color="primary"
                    variant="outlined">
                    {{ method.name }}
                  </v-btn>
                </v-btn-toggle>
              </div>
            </v-card>
          </v-col>

          <!-- CALCULATOR -->
          <v-col cols="12" md="4" class="d-flex">
            <v-card class="pa-4 flex-grow-1">
              <!-- "SCREEN" -->
              <v-sheet class="pa-4 text-h5 text-right font-weight-bold d-flex justify-space-between align-center"
                elevation="2" height="60">
                <span>{{ display || '0' }}</span>
                <v-btn icon color="error" @click="deleteNumber" class="d-flex align-center">
                  <v-icon>mdi-backspace</v-icon>
                </v-btn>
              </v-sheet>
              <!-- BUTTONS -->
              <v-container fluid>
                <v-row v-for="(row, rowIndex) in buttons" :key="rowIndex" class="mb-2" dense>
                  <v-col v-for="(btn, index) in row" :key="index" cols="4">
                    <v-btn block color="primary" variant="outlined" class="text-h6" @click="addNumber(btn)"
                      :disabled="isLocked">
                      {{ btn }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>

          <!-- PAYMENTS LIST -->
          <v-col cols="12" md="4" class="d-flex">
            <v-card class="pa-4 flex-grow-1">
              <v-row>
                <v-col cols="12">
                  <div class="font-weight-medium mb-4">Pagos</div>

                  <!-- If no payments, show 'Sin pagos' -->
                  <v-list v-if="payments.length > 0">
                    <v-list-item-group v-for="(payment, index) in payments" :key="index">
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>{{ payment }}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>

                  <!-- Show 'Sin pagos' if no items -->
                  <v-alert v-else type="info" border="left">
                    Sin pagos
                  </v-alert>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>

        <!-- FOOTER -->
        <v-row class="mt-5 d-flex justify-space-between">
          <v-col cols="6" md="5">
            <v-row>
              <v-col cols="12" class="mb-3">
                <v-sheet class="pa-4" elevation="2">
                  <div class="font-weight-medium">Total Pagado</div>
                  <div class="text-h6">${{ totalPaid }}</div>
                </v-sheet>
              </v-col>

              <v-col cols="12" class="mb-3">
                <v-sheet class="pa-4" elevation="2">
                  <div class="font-weight-medium">Restante por pagar</div>
                  <div class="text-h6">${{ remainingAmount }}</div>
                </v-sheet>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="3" class="text-center">
            <v-btn color="success" class="text-h5" block large @click="handlePayment">
              Pagar propina
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
//IMPORTS
import { ref, computed, onMounted } from 'vue'

//COMPONENTS
import SideBar from '@/layouts/SideBar.vue'

// SERVICES
import { apiService } from '@/services/ApiService'

const title = 'Propina'
const showBackButton = true
const isLocked = ref(false)
const tip_id = ref<number | null>(null)

const amount = ref<number | null>(0)
const waiters = ref<number>(1)
const paymentMethod = ref<number>(1)
const payments = ref<string[]>([])
const paymentMethods = ref<{ value: number; name: string }[]>([])
const display = ref('')
const isEditing = ref(true)

const totalPaid = ref(0)
const totalAmount = ref(5500)
const remainingAmount = ref(amount.value - totalPaid.value)

onMounted(async () => {
  try {

    const response = await apiService.paymentMethods()
    paymentMethods.value = response.map((method: any) => ({
      value: method.id,
      name: method.name,
    }))
  } catch (error) {
    console.error('Error fetching payment methods:', error)
  }
  try {
    await getPayments()
  } catch (error) {
    console.error(error);
  }

}
)
const getPayments = async () => {
  try {
    const response = await apiService.payments()

    payments.value = response.map((payment: any) => {
      const paymentMethod = paymentMethods.value.find(
        (method: { value: string }) => method.value === payment.payment_method_id
      );
      payment.amount = parseFloat(payment.amount)
      const amount = payment.amount.toLocaleString('es-MX', {
        style: 'currency',
        currency: 'MXN',
      })
      console.log("🚀 ~ payments.value=response.map ~ amount:", amount)
      const paymentMethodName = paymentMethod ? paymentMethod.name : 'Desconocido';
      return `${amount} ${paymentMethodName}`;
    });
  } catch (error) {
    console.error('Error fetching payments:', error)
  }
}

const buttons = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['00', '0', 'OK'],
]

const formattedResult = computed(() => {
  if (!amount.value || !waiters.value) return '$0.00'

  const result = amount.value / waiters.value || 1
  return result.toLocaleString('es-MX', {
    style: 'currency',
    currency: 'MXN',
  })
})

const saveTip = async () => {
  isEditing.value = !isEditing.value
  if (!isEditing.value) {
    if (!amount.value) return
    const result = await apiService.saveTip({
      total_amount: amount.value,
      notes: 'Propina',
    })

    tip_id.value = result.id
    console.log('Propina guardada:', result)

    remainingAmount.value = amount.value - totalPaid.value

    display.value = formattedResult.value;
  }
}

const deleteNumber = () => {
  display.value = display.value.slice(0, -1)
}

const addNumber = (value: string) => {
  if (value === 'OK') {
    isLocked.value = true
    return
  }

  if (!isLocked.value) {
    display.value += value
  }
}


const handlePayment = async () => {
  const payment = parseFloat(display.value.replace(/[^\d.-]/g, ''))
  display.value = ''
  isLocked.value = false
  if (paymentMethod.value && payment <= remainingAmount.value) {
    totalPaid.value += payment;
    remainingAmount.value = amount.value - totalPaid.value;
    const payload = {
      tip_id: tip_id.value,
      payment_method_id: paymentMethod.value,
      amount: payment,
      receipt_number: Math.random().toString(36).substring(2, 15),
    }
    try {
      const response = await apiService.savePayment(payload)
    } catch (error) {
      throw new Error("Error al guardar el pago: ", error);
    }

    try {
      await getPayments()
    } catch (error) {
      console.error(error);
    }
  } else {
    console.error('Payment exceeds the remaining amount or no payment method selected');
  }
  console.log('Propina pagada!')
}
</script>

<style scoped>
.font-weight-medium {
  font-weight: 500
}

.text-h6 {
  font-size: 24px
}

.d-flex {
  display: flex;
}

.flex-grow-1 {
  flex-grow: 1;
}

.v-row {
  height: 100%;
}
</style>
