const pool = require('../config/db');

exports.crearTicket = async (req, res) => {
	console.log('Contenido de req.usuario:', req.usuario); // 
  try {
    const { asunto, descripcion } = req.body;
    const id_usuario = req.usuario.id;;

    if (!asunto || !descripcion) {
      return res.status(400).json({ error: 'Debe ingresar asunto y descripción' });
    }

    await pool.query('CALL sp_crear_ticket(?, ?, ?)', [id_usuario, asunto, descripcion]);
    res.status(200).json({ mensaje: 'Ticket creado correctamente' });

  } catch (err) {
    console.error('Error en crearTicket:', err);
    res.status(500).json({ error: 'Error al crear el ticket', detalle: err.message });
  }
};

exports.responderTicket = async (req, res) => {
  try {
    const { id_ticket, mensaje } = req.body;
    const id_usuario = req.usuario.id;;

    if (!id_ticket || !mensaje) {
      return res.status(400).json({ error: 'Debe ingresar ID del ticket y mensaje' });
    }

    await pool.query('CALL sp_responder_ticket(?, ?, ?)', [id_ticket, id_usuario, mensaje]);
    res.status(200).json({ mensaje: 'Respuesta enviada correctamente' });

  } catch (err) {
    console.error('Error en responderTicket:', err);
    res.status(500).json({ error: 'Error al responder el ticket', detalle: err.message });
  }
};

exports.cambiarEstado = async (req, res) => {
  try {
    const { id_ticket, estado } = req.body;

    if (!id_ticket || !estado) {
      return res.status(400).json({ error: 'Debe ingresar ID del ticket y estado' });
    }

    await pool.query('CALL sp_cambiar_estado_ticket(?, ?)', [id_ticket, estado]);
    res.status(200).json({ mensaje: 'Estado del ticket actualizado' });

  } catch (err) {
    console.error('Error en cambiarEstado:', err);
    res.status(500).json({ error: 'Error al cambiar estado', detalle: err.message });
  }
};

exports.listarTicketsAdmin = async (req, res) => {
  try {
    const [tickets] = await pool.query('CALL sp_listar_tickets_admin()');
    res.json(tickets[0]);
  } catch (err) {
    console.error('Error en listarTicketsAdmin:', err);
    res.status(500).json({ error: 'Error al obtener tickets', detalle: err.message });
  }
};

exports.listarTicketsUsuario = async (req, res) => {
  try {
    const id_usuario = req.usuario.id;;

    const [tickets] = await pool.query('CALL sp_listar_tickets_por_usuario(?)', [id_usuario]);
    res.json(tickets[0]);

  } catch (err) {
    console.error('Error en listarTicketsUsuario:', err);
    res.status(500).json({ error: 'Error al obtener tickets del usuario', detalle: err.message });
  }
};

exports.listarRespuestas = async (req, res) => {
  try {
    const id_ticket = req.params.id;

    if (!id_ticket) {
      return res.status(400).json({ error: 'ID del ticket no proporcionado' });
    }

    const [respuestas] = await pool.query('CALL sp_listar_respuestas_ticket(?)', [id_ticket]);
    res.json(respuestas[0]);

  } catch (err) {
    console.error('Error en listarRespuestas:', err);
    res.status(500).json({ error: 'Error al obtener respuestas', detalle: err.message });
  }
};
