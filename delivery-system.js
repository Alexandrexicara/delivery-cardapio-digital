// Sistema de Delivery com Taxas Corretas
// Plataforma: R$0,10 por pedido
// Motoboy: R$2,00 por km (configurável)

class DeliverySystem {
    constructor() {
        this.plataformaTaxaFixa = 0.10; // R$0,10 por pedido
        this.motoboyValorKm = 2.00; // R$2,00 por km
        this.motoboys = [];
        this.pedidos = [];
    }

    // Calcular taxas de entrega
    calcularTaxasEntrega(distanciaKm, valorTotal) {
        const taxaPlataforma = this.plataformaTaxaFixa;
        const taxaMotoboy = distanciaKm * this.motoboyValorKm;
        const totalTaxas = taxaPlataforma + taxaMotoboy;
        const valorLiquido = valorTotal - totalTaxas;

        return {
            valorTotal: valorTotal,
            taxaPlataforma: taxaPlataforma,
            taxaMotoboy: taxaMotoboy,
            totalTaxas: totalTaxas,
            valorLiquido: valorLiquido,
            distanciaKm: distanciaKm,
            valorPorKm: this.motoboyValorKm
        };
    }

    // Cadastrar motoboy
    cadastrarMotoboy(dadosMotoboy) {
        const motoboy = {
            id: Date.now().toString(),
            nome: dadosMotoboy.nome,
            cpf: dadosMotoboy.cpf,
            telefone: dadosMotoboy.telefone,
            veiculo: dadosMotoboy.veiculo,
            placa: dadosMotoboy.placa,
            disponivel: true,
            localizacao: {
                lat: dadosMotoboy.lat || 0,
                lng: dadosMotoboy.lng || 0
            },
            totalEntregas: 0,
            totalGanho: 0,
            dataCadastro: new Date().toISOString()
        };

        this.motoboys.push(motoboy);
        console.log('[Delivery] Motoboy cadastrado:', motoboy);
        return motoboy;
    }

    // Encontrar motoboy disponível mais próximo
    encontrarMotoboyProximo(latCliente, lngCliente) {
        const motoboysDisponiveis = this.motoboys.filter(m => m.disponivel);
        
        if (motoboysDisponiveis.length === 0) {
            return null;
        }

        let motoboyMaisProximo = null;
        let menorDistancia = Infinity;

        motoboysDisponiveis.forEach(motoboy => {
            const distancia = this.calcularDistancia(
                latCliente, lngCliente,
                motoboy.localizacao.lat, motoboy.localizacao.lng
            );

            if (distancia < menorDistancia) {
                menorDistancia = distancia;
                motoboyMaisProximo = motoboy;
            }
        });

        return {
            motoboy: motoboyMaisProximo,
            distancia: menorDistancia
        };
    }

    // Calcular distância (fórmula de Haversine)
    calcularDistancia(lat1, lng1, lat2, lng2) {
        const R = 6371; // Raio da Terra em km
        const dLat = this.toRad(lat2 - lat1);
        const dLng = this.toRad(lng2 - lng1);
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c; // Distância em km
    }

    toRad(degrees) {
        return degrees * (Math.PI/180);
    }

    // Criar pedido de delivery
    criarPedido(dadosPedido) {
        const taxas = this.calcularTaxasEntrega(
            dadosPedido.distanciaKm,
            dadosPedido.valorTotal
        );

        const motoboyProximo = this.encontrarMotoboyProximo(
            dadosPedido.latCliente,
            dadosPedido.lngCliente
        );

        if (!motoboyProximo) {
            throw new Error('Nenhum motoboy disponível no momento');
        }

        const pedido = {
            id: Date.now().toString(),
            numero: this.pedidos.length + 1,
            cliente: dadosPedido.cliente,
            endereco: dadosPedido.endereco,
            localizacao: {
                lat: dadosPedido.latCliente,
                lng: dadosPedido.lngCliente
            },
            itens: dadosPedido.itens,
            valorTotal: dadosPedido.valorTotal,
            taxas: taxas,
            motoboy: motoboyProximo.motoboy,
            status: 'pendente',
            dataCriacao: new Date().toISOString(),
            tempoEstimado: Math.ceil(motoboyProximo.distancia * 5) // 5 min por km
        };

        // Atualizar status do motoboy
        motoboyProximo.motoboy.disponivel = false;
        motoboyProximo.motoboy.totalEntregas++;
        motoboyProximo.motoboy.totalGanho += taxas.taxaMotoboy;

        this.pedidos.push(pedido);
        console.log('[Delivery] Pedido criado:', pedido);
        return pedido;
    }

    // Atualizar status do pedido
    atualizarStatusPedido(pedidoId, novoStatus) {
        const pedido = this.pedidos.find(p => p.id === pedidoId);
        if (!pedido) {
            throw new Error('Pedido não encontrado');
        }

        pedido.status = novoStatus;
        pedido[`data${novoStatus.charAt(0).toUpperCase() + novoStatus.slice(1)}`] = new Date().toISOString();

        // Se pedido foi entregue, liberar motoboy
        if (novoStatus === 'entregue') {
            pedido.motoboy.disponivel = true;
        }

        console.log('[Delivery] Status atualizado:', pedidoId, novoStatus);
        return pedido;
    }

    // Obter pedidos do motoboy
    getPedidosMotoboy(motoboyId) {
        return this.pedidos.filter(p => p.motoboy.id === motoboyId);
    }

    // Obter estatísticas do motoboy
    getEstatisticasMotoboy(motoboyId) {
        const motoboy = this.motoboys.find(m => m.id === motoboyId);
        if (!motoboy) {
            return null;
        }

        const pedidos = this.getPedidosMotoboy(motoboyId);
        const entregues = pedidos.filter(p => p.status === 'entregue');
        const totalGanho = entregues.reduce((sum, p) => sum + p.taxas.taxaMotoboy, 0);

        return {
            motoboy: motoboy,
            totalEntregas: entregues.length,
            totalGanho: totalGanho,
            mediaPorEntrega: entregues.length > 0 ? totalGanho / entregues.length : 0,
            pedidosPendentes: pedidos.filter(p => p.status === 'pendente').length,
            pedidosEmAndamento: pedidos.filter(p => p.status === 'em_andamento').length
        };
    }

    // Calcular comissão da plataforma
    calcularComissaoPlataforma(dataInicio, dataFim) {
        const pedidosPeriodo = this.pedidos.filter(p => {
            const dataPedido = new Date(p.dataCriacao);
            return dataPedido >= new Date(dataInicio) && dataPedido <= new Date(dataFim);
        });

        const totalComissao = pedidosPeriodo.reduce((sum, p) => sum + p.taxas.taxaPlataforma, 0);

        return {
            periodo: { inicio: dataInicio, fim: dataFim },
            totalPedidos: pedidosPeriodo.length,
            totalComissao: totalComissao,
            pedidos: pedidosPeriodo
        };
    }
}

// Exportar para usar no sistema
window.DeliverySystem = DeliverySystem;
